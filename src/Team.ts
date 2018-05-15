/// <reference path="Compatibility.ts"/>

class Team{
    private _id:number;
    private _people:string[];
    private _compatibility:string[];
    private _peoplePerTeam:number;

    constructor(id:number, ppt:number, allPeople:string[]){
        this._id = id;
        this._peoplePerTeam = ppt;
        this._people = [];
        this._compatibility = allPeople;
    }

    get id(): number {
        return this._id;
    }

    get compatibility():string[]{
        return this._compatibility;
    }

    undoCompatiblePerson(people:string[]):void{
        for(let p of people){
            let index:number = this._people.indexOf(p);
            if(index != 0){
                this._people.splice(index, 1);
            }
            this._compatibility.push(p);
        }
    }

    addCompatiblePerson(comp:Compatibility):string[]{
        this._compatibility.sort((a,b)=>{return comp.getCompatibility(a).length - comp.getCompatibility(b).length + 0.1 * (Math.random() - 0.5)})
        let person: string = this._compatibility.splice(0, 1)[0]
        this._people.push(person);
        let result:string[] = [person];
        for(let i:number=0; i<this._compatibility.length; i++){
            if(!comp.checkCompatible(person, this._compatibility[i])){
                result.push(this._compatibility.splice(i, 1)[0]);
                i--;
            }
        }
        return result;
    }

    updateCompatibility(person:string):boolean{
        let index:number=this._compatibility.indexOf(person);
        if(index == -1){
            return false;
        }
        this._compatibility.splice(index, 1);
        return true;
    }

    isSolved():boolean{
        return this._people.length == this._peoplePerTeam;
    }

    toString():string{
        let result:string = "Team " + (this._id + 1) + ": ";
        for(let p of this._people){
            result += p + ", ";
        }
        result = result.substr(0, result.length-2);
        result += "\n";
        return result;
    }
}