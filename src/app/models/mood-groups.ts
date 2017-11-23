import {Mood} from './mood';
export class MoodGroups {


    private _name: string;
    private _moods: Mood[];


    constructor(pName: string, pMoodList: Mood[]) {
        this._name = pName;
        this._moods = pMoodList;
    }

    public addMood(pMood: Mood): void {
        this._moods.push(pMood);
    }

    //sort moods only make sense in english browser language!!
    public sortMoods(): void {
        this._moods.sort((a: Mood, b: Mood) => a.name.localeCompare(b.name));
        //There is no way to get translated values in ts
            //this._moods.sort((a: Mood, b: Mood) => ('MOODS.'+a.name.toUpperCase() | translate).localeCompare
            // ('MOODS.'+b.name.toUpperCase() | translate));

    }

    get name(): string {
        return this._name;
    }

    get moods(): Mood[] {
        return this._moods;
    }


}
