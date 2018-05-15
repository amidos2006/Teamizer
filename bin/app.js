var Compatibility = (function () {
    function Compatibility(allPeople) {
        this._allPeople = [];
        this._compatibilityMatrix = {};
        for (var _i = 0, allPeople_1 = allPeople; _i < allPeople_1.length; _i++) {
            var p1 = allPeople_1[_i];
            this._allPeople.push(p1);
            this._compatibilityMatrix[p1] = {};
            for (var _a = 0, allPeople_2 = allPeople; _a < allPeople_2.length; _a++) {
                var p2 = allPeople_2[_a];
                if (p1 == p2) {
                    this._compatibilityMatrix[p1][p2] = false;
                }
                else {
                    this._compatibilityMatrix[p1][p2] = true;
                }
            }
        }
    }
    Object.defineProperty(Compatibility.prototype, "allPeople", {
        get: function () {
            return this._allPeople.slice();
        },
        enumerable: true,
        configurable: true
    });
    Compatibility.prototype.removePerson = function (person) {
        this._allPeople.splice(this._allPeople.indexOf(person), 1);
        delete this._compatibilityMatrix[person];
        for (var _i = 0, _a = this._allPeople; _i < _a.length; _i++) {
            var p = _a[_i];
            delete this._compatibilityMatrix[p][person];
        }
    };
    Compatibility.prototype.addPerson = function (person) {
        for (var _i = 0, _a = this._allPeople; _i < _a.length; _i++) {
            var p = _a[_i];
            this._compatibilityMatrix[p][person] = true;
        }
        this._allPeople.push(person);
        this._compatibilityMatrix[person] = {};
        for (var _b = 0, _c = this._allPeople; _b < _c.length; _b++) {
            var p = _c[_b];
            if (p == person) {
                this._compatibilityMatrix[person][p] = false;
            }
            else {
                this._compatibilityMatrix[person][p] = true;
            }
        }
    };
    Compatibility.prototype.checkCompatible = function (person1, person2) {
        return this._compatibilityMatrix[person1][person2];
    };
    Compatibility.prototype.updateCompatibility = function (person1, person2, value) {
        this._compatibilityMatrix[person1][person2] = value;
        this._compatibilityMatrix[person2][person1] = value;
    };
    Compatibility.prototype.getCompatibility = function (person) {
        var result = [];
        for (var _i = 0, _a = this._allPeople; _i < _a.length; _i++) {
            var p = _a[_i];
            if (this.checkCompatible(person, p)) {
                result.push(p);
            }
        }
        return result;
    };
    Compatibility.prototype.getSortedCompatibility = function () {
        var results = [];
        for (var _i = 0, _a = this._allPeople; _i < _a.length; _i++) {
            var p = _a[_i];
            results.push(this.getCompatibility(p));
        }
        results.sort(function (a, b) { return a.length - b.length; });
        return results;
    };
    Compatibility.prototype.clone = function () {
        var clone = new Compatibility(this._allPeople);
        for (var _i = 0, _a = this._allPeople; _i < _a.length; _i++) {
            var p1 = _a[_i];
            for (var _b = 0, _c = this._allPeople; _b < _c.length; _b++) {
                var p2 = _c[_b];
                clone.updateCompatibility(p1, p2, this.checkCompatible(p1, p2));
            }
        }
        return clone;
    };
    return Compatibility;
}());
/// <reference path="Compatibility.ts"/>
var Team = (function () {
    function Team(id, ppt, allPeople) {
        this._id = id;
        this._peoplePerTeam = ppt;
        this._people = [];
        this._compatibility = allPeople;
    }
    Object.defineProperty(Team.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Team.prototype, "compatibility", {
        get: function () {
            return this._compatibility;
        },
        enumerable: true,
        configurable: true
    });
    Team.prototype.undoCompatiblePerson = function (people) {
        for (var _i = 0, people_1 = people; _i < people_1.length; _i++) {
            var p = people_1[_i];
            var index = this._people.indexOf(p);
            if (index != 0) {
                this._people.splice(index, 1);
            }
            this._compatibility.push(p);
        }
    };
    Team.prototype.addCompatiblePerson = function (comp) {
        this._compatibility.sort(function (a, b) { return comp.getCompatibility(a).length - comp.getCompatibility(b).length + 0.1 * (Math.random() - 0.5); });
        var person = this._compatibility.splice(0, 1)[0];
        this._people.push(person);
        var result = [person];
        for (var i = 0; i < this._compatibility.length; i++) {
            if (!comp.checkCompatible(person, this._compatibility[i])) {
                result.push(this._compatibility.splice(i, 1)[0]);
                i--;
            }
        }
        return result;
    };
    Team.prototype.updateCompatibility = function (person) {
        var index = this._compatibility.indexOf(person);
        if (index == -1) {
            return false;
        }
        this._compatibility.splice(index, 1);
        return true;
    };
    Team.prototype.isSolved = function () {
        return this._people.length == this._peoplePerTeam;
    };
    Team.prototype.toString = function () {
        var result = "Team " + (this._id + 1) + ": ";
        for (var _i = 0, _a = this._people; _i < _a.length; _i++) {
            var p = _a[_i];
            result += p + ", ";
        }
        result = result.substr(0, result.length - 2);
        result += "\n";
        return result;
    };
    return Team;
}());
/// <reference path="Compatibility.ts"/>
/// <reference path="Team.ts"/>
var TeamSolver = (function () {
    function TeamSolver(comp) {
        this._compatibility = comp;
        this._undoStack = [];
    }
    TeamSolver.prototype.undoStep = function (remainingPeople, teams) {
        if (this._undoStack.length == 0) {
            return false;
        }
        var undoObject = this._undoStack.pop();
        remainingPeople.push(undoObject[0].people[0]);
        for (var _i = 0, undoObject_1 = undoObject; _i < undoObject_1.length; _i++) {
            var o = undoObject_1[_i];
            teams[o.id].undoCompatiblePerson(o.people);
        }
        return true;
    };
    TeamSolver.prototype.updateTeamStep = function (teams) {
        teams.sort(function (a, b) { return a.compatibility.length - b.compatibility.length + 0.1 * (Math.random() - 0.5); });
        var t = teams[0];
        if (t.compatibility.length == 0) {
            return null;
        }
        var people = t.addCompatiblePerson(this._compatibility);
        var undoObject = [{
                id: t.id,
                people: people
            }];
        for (var _i = 0, teams_1 = teams; _i < teams_1.length; _i++) {
            var t_1 = teams_1[_i];
            if (t_1.updateCompatibility(people[0])) {
                undoObject.push({
                    id: t_1.id,
                    people: [people[0]]
                });
            }
        }
        this._undoStack.push(undoObject);
        return people[0];
    };
    TeamSolver.prototype.getUnsolvedTeams = function (teams) {
        var result = [];
        for (var _i = 0, teams_2 = teams; _i < teams_2.length; _i++) {
            var t = teams_2[_i];
            if (!t.isSolved()) {
                result.push(t);
            }
        }
        return result;
    };
    TeamSolver.prototype.getTeams = function (peoplePerTeam, teamNumber, maxIterations) {
        if (maxIterations === void 0) { maxIterations = 50000; }
        var remainingPeople = this._compatibility.allPeople;
        var teams = [];
        for (var i = 0; i < teamNumber; i++) {
            teams.push(new Team(i, peoplePerTeam, this._compatibility.allPeople));
        }
        var unsolvedTeams = this.getUnsolvedTeams(teams);
        var iterations = 0;
        while (unsolvedTeams.length > 0 && remainingPeople.length > 0) {
            var person = this.updateTeamStep(unsolvedTeams);
            if (person == null) {
                var randomUndoLength = Math.max(Math.floor(Math.random() * this._undoStack.length), 1);
                for (var i = 0; i < randomUndoLength; i++) {
                    this.undoStep(remainingPeople, teams);
                }
                continue;
            }
            else {
                var index = remainingPeople.indexOf(person);
                if (index != -1) {
                    remainingPeople.splice(index, 1);
                }
            }
            unsolvedTeams = this.getUnsolvedTeams(teams);
            iterations += 1;
            if (iterations > maxIterations) {
                return null;
            }
        }
        return teams;
    };
    return TeamSolver;
}());
/// <reference path="TeamSolver.ts"/>
var comp = new Compatibility([]);
function addPerson() {
    var person = document.getElementById('newMember').value.trim();
    if (person.length == 0) {
        return;
    }
    document.getElementById("newMember").value = "";
    comp.addPerson(person);
    var option = document.createElement("option");
    option.text = person;
    var selection = document.getElementById("allPeople");
    selection.add(option);
    updateCompatibilityList();
}
function clearCheckboxes() {
    var checkboxes = document.getElementById("compatabilities");
    for (var i = 0; i < checkboxes.childNodes.length; i++) {
        checkboxes.removeChild(checkboxes.childNodes[i]);
        i--;
    }
}
function updateCompatibilityList() {
    clearCheckboxes();
    var selection = document.getElementById("allPeople");
    if (selection.selectedIndex == -1) {
        return;
    }
    var selectedPerson = selection.options[selection.selectedIndex].value;
    var removeButton = document.getElementById("removePerson");
    var checkboxes = document.getElementById("compatabilities");
    if (selection.selectedIndex >= 0) {
        removeButton.disabled = false;
        for (var _i = 0, _a = comp.allPeople; _i < _a.length; _i++) {
            var p = _a[_i];
            if (p == selectedPerson) {
                continue;
            }
            var currentItem = document.createElement("li");
            var label = document.createElement("label");
            label.textContent = p;
            var inputItem = document.createElement("input");
            inputItem.type = "checkbox";
            inputItem.checked = comp.checkCompatible(selectedPerson, p);
            label.appendChild(inputItem);
            inputItem.onchange = updateCompObject;
            currentItem.appendChild(label);
            checkboxes.appendChild(currentItem);
        }
    }
    else {
        removeButton.disabled = true;
    }
}
function updateCompObject(event) {
    var selection = document.getElementById("allPeople");
    var selectedPerson = selection.options[selection.selectedIndex].value;
    var checkBox = this;
    var checkedPerson = checkBox.parentElement.textContent;
    comp.updateCompatibility(checkedPerson, selectedPerson, checkBox.checked);
}
function clearTeams() {
    comp = new Compatibility([]);
    var selection = document.getElementById("allPeople");
    var removeButton = document.getElementById("removePerson");
    removeButton.disabled = true;
    for (var i = 0; i < selection.options.length; i++) {
        selection.options[i] = null;
        i--;
    }
    document.getElementById("solution").value = "";
    clearCheckboxes();
}
function removePerson() {
    var selection = document.getElementById("allPeople");
    comp.removePerson(selection.options[selection.selectedIndex].value);
    selection.options[selection.selectedIndex] = null;
    updateCompatibilityList();
}
function getTeams() {
    var teamSolver = new TeamSolver(comp);
    var teams = teamSolver.getTeams(parseInt(document.getElementById("ppt").value), parseInt(document.getElementById("nt").value));
    if (teams == null) {
        document.getElementById("solution").value = "Team are not possible with the current constraints";
        return;
    }
    var result = "";
    for (var _i = 0, teams_3 = teams; _i < teams_3.length; _i++) {
        var t = teams_3[_i];
        result += t.toString();
    }
    document.getElementById("solution").value = result;
}
