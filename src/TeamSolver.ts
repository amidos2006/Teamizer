/// <reference path="Compatibility.ts"/>
/// <reference path="Team.ts"/>

class TeamSolver{
    private _compatibility:Compatibility;
    private _undoStack:any[][];

    constructor(comp:Compatibility){
        this._compatibility = comp;
        this._undoStack = [];
    }

    private undoStep(remainingPeople:string[], teams:Team[]):boolean{
        if(this._undoStack.length == 0){
            return false;
        }
        let undoObject:any[] = this._undoStack.pop();
        remainingPeople.push(undoObject[0].people[0]);
        for(let o of undoObject){
            teams[o.id].undoCompatiblePerson(o.people);
        }
        return true;
    }

    private updateTeamStep(teams:Team[]):string{
        teams.sort((a, b)=>{return a.compatibility.length - b.compatibility.length + 0.1 * (Math.random() - 0.5)});
        let t:Team = teams[0];
        if(t.compatibility.length == 0){
            return null;
        }
        let people:string[] = t.addCompatiblePerson(this._compatibility);
        let undoObject:any[] = [{
            id:t.id,
            people:people
        }];
        for(let t of teams){
            if(t.updateCompatibility(people[0])){
                undoObject.push({
                    id:t.id,
                    people:[people[0]]
                });
            }
        }
        this._undoStack.push(undoObject);
        return people[0];
    }

    private getUnsolvedTeams(teams:Team[]):Team[]{
        let result:Team[] = [];
        for(let t of teams){
            if(!t.isSolved()){
                result.push(t);
            }
        }
        return result;
    }

    getTeams(peoplePerTeam:number, teamNumber:number, maxIterations:number=50000):Team[]{
        let remainingPeople:string[] = this._compatibility.allPeople;
        let teams:Team[] = [];
        for(let i:number=0; i<teamNumber; i++){
            teams.push(new Team(i, peoplePerTeam, this._compatibility.allPeople));
        }
        let unsolvedTeams:Team[] = this.getUnsolvedTeams(teams);
        let iterations:number = 0;
        while(unsolvedTeams.length > 0 && remainingPeople.length > 0){
            let person:string = this.updateTeamStep(unsolvedTeams);
            if(person == null){
                let randomUndoLength:number = Math.max(Math.floor(Math.random() * this._undoStack.length), 1);
                for(let i:number=0; i<randomUndoLength; i++){
                    this.undoStep(remainingPeople, teams);
                }
                continue;
            }
            else{
                let index:number = remainingPeople.indexOf(person);
                if(index != -1){
                    remainingPeople.splice(index, 1);
                }
            }
            unsolvedTeams = this.getUnsolvedTeams(teams);
            iterations += 1;
            if(iterations > maxIterations){
                return null;
            }
        }
        return teams;
    }
}