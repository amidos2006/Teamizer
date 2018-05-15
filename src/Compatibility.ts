class Compatibility{
    private _allPeople:string[];
    private _compatibilityMatrix:Object;

    constructor(allPeople:string[]){
        this._allPeople = [];
        this._compatibilityMatrix = {};
        for(let p1 of allPeople){
            this._allPeople.push(p1);
            this._compatibilityMatrix[p1] = {}
            for(let p2 of allPeople){
                if(p1 == p2){
                    this._compatibilityMatrix[p1][p2] = false;
                }
                else{
                    this._compatibilityMatrix[p1][p2] = true
                }
            }
        }
    }

    get allPeople():string[]{
        return this._allPeople.slice();
    }

    removePerson(person:string):void{
        this._allPeople.splice(this._allPeople.indexOf(person), 1);
        delete this._compatibilityMatrix[person];
        for(let p of this._allPeople){
            delete this._compatibilityMatrix[p][person];
        }
    }

    addPerson(person:string):void{
        for(let p of this._allPeople){
            this._compatibilityMatrix[p][person] = true;
        }
        this._allPeople.push(person);
        this._compatibilityMatrix[person] = {};
        for(let p of this._allPeople){
            if (p == person) {
                this._compatibilityMatrix[person][p] = false;
            }
            else {
                this._compatibilityMatrix[person][p] = true
            }
        }
    }

    checkCompatible(person1:string, person2:string):boolean{
        return this._compatibilityMatrix[person1][person2];
    }

    updateCompatibility(person1:string, person2:string, value:boolean):void{
        this._compatibilityMatrix[person1][person2] = value;
        this._compatibilityMatrix[person2][person1] = value;
    }

    getCompatibility(person:string):string[]{
        let result:string[] = [];
        for(let p of this._allPeople){
            if(this.checkCompatible(person, p)){
                result.push(p);
            }
        }
        return result;
    }

    getSortedCompatibility():string[][]{
        let results:string[][] = [];
        for(let p of this._allPeople){
            results.push(this.getCompatibility(p));
        }
        results.sort((a, b)=>{return a.length - b.length});
        return results;
    }

    clone():Compatibility{
        let clone:Compatibility = new Compatibility(this._allPeople);
        for(let p1 of this._allPeople){
            for(let p2 of this._allPeople){
                clone.updateCompatibility(p1, p2, this.checkCompatible(p1, p2));
            }
        }
        return clone;
    }
}