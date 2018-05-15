/// <reference path="TeamSolver.ts"/>

let comp:Compatibility = new Compatibility([]);

function addPerson():void{
    let person: string = (<HTMLInputElement>document.getElementById('newMember')).value.trim();
    if (person.length == 0) {
        return;
    }
    (<HTMLInputElement>document.getElementById("newMember")).value = "";
    comp.addPerson(person);
    let option:HTMLOptionElement = document.createElement("option");
    option.text = person;
    let selection: HTMLSelectElement = <HTMLSelectElement>document.getElementById("allPeople");
    selection.add(option);
    updateCompatibilityList();
}

function clearCheckboxes():void{
    let checkboxes: HTMLUListElement = <HTMLUListElement>document.getElementById("compatabilities");
    for (let i: number = 0; i < checkboxes.childNodes.length; i++) {
        checkboxes.removeChild(checkboxes.childNodes[i]);
        i--;
    }
}

function updateCompatibilityList():void{
    clearCheckboxes();
    let selection: HTMLSelectElement = <HTMLSelectElement>document.getElementById("allPeople");
    if(selection.selectedIndex == -1){
        return;
    }
    let selectedPerson: string = selection.options[selection.selectedIndex].value
    let removeButton:HTMLButtonElement = <HTMLButtonElement>document.getElementById("removePerson");
    let checkboxes: HTMLUListElement = <HTMLUListElement>document.getElementById("compatabilities");
    if(selection.selectedIndex >= 0){
        removeButton.disabled = false;
        for(let p of comp.allPeople){
            if (p == selectedPerson){
                continue;
            }
            let currentItem = document.createElement("li");
            let label = document.createElement("label");
            label.textContent = p;
            let inputItem = document.createElement("input");
            inputItem.type = "checkbox";
            inputItem.checked = comp.checkCompatible(selectedPerson, p);
            label.appendChild(inputItem);
            inputItem.onchange = updateCompObject;
            currentItem.appendChild(label);
            checkboxes.appendChild(currentItem);
        }
    }
   else{
        removeButton.disabled = true;
   }
}

function updateCompObject(event):void{
    let selection: HTMLSelectElement = <HTMLSelectElement>document.getElementById("allPeople");
    let selectedPerson: string = selection.options[selection.selectedIndex].value;
    let checkBox:HTMLInputElement = <HTMLInputElement>this;
    let checkedPerson:string = checkBox.parentElement.textContent;
    comp.updateCompatibility(checkedPerson, selectedPerson, checkBox.checked);
}

function clearTeams():void{
    comp = new Compatibility([]);
    let selection: HTMLSelectElement = <HTMLSelectElement>document.getElementById("allPeople");
    let removeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("removePerson");
    removeButton.disabled = true;
    for(let i:number=0; i<selection.options.length; i++){
        selection.options[i] = null;
        i--;
    }
    (<HTMLTextAreaElement>document.getElementById("solution")).value = "";
    clearCheckboxes();
}

function removePerson():void{
    let selection: HTMLSelectElement = <HTMLSelectElement>document.getElementById("allPeople");
    comp.removePerson(selection.options[selection.selectedIndex].value);
    selection.options[selection.selectedIndex] = null;
    updateCompatibilityList();
}

function getTeams():void{
    let teamSolver: TeamSolver = new TeamSolver(comp);
    let teams: Team[] = teamSolver.getTeams(
        parseInt((<HTMLInputElement>document.getElementById("ppt")).value), 
        parseInt((<HTMLInputElement>document.getElementById("nt")).value));
    if(teams == null){
        (<HTMLTextAreaElement>document.getElementById("solution")).value = "Team are not possible with the current constraints";
        return;
    }
    let result:string = "";
    for (let t of teams) {
        result += t.toString();
    }
    (<HTMLTextAreaElement>document.getElementById("solution")).value = result;
}