import {Mood} from './mood';

export class Moods {

    private _moodlist: Mood[] = [];


    constructor() {
        this._moodlist.push(new Mood(0, 'neutral', 0, 0));
        this._moodlist.push(new Mood(1, 'happy', 0.15, 0.9));
        this._moodlist.push(new Mood(2, 'joyous', 0.12, 0.95));
    }

    get moodlist(): Mood[] {
        return this._moodlist;
    }

    public getMoodLabels(): string[] {
        let moodLabels: string[] = [];
        for (let m of this._moodlist){
            moodLabels.push(m.name);
        }
        return moodLabels;
    }

    //return nearest mood for given a/v values
    public getMood(pArousal: number, pValence: number): Mood {
        let minDist: number = Math.sqrt(8);
        let nMood: Mood;
        for (let mood of this._moodlist){
            //calculate distance
            let dist =  Math.sqrt((Math.pow((mood.arousal - pArousal), 2) + (Math.pow((mood.valence - pValence), 2))));
            if (dist < minDist ) {
                minDist = dist;
                nMood = mood;
            }
        }
        return nMood;
    }

    //return the Arousal/Valence for given mood tag
    public getAV(pName: string): Mood {
        for (let mood of this._moodlist) {
            if (pName === mood.name) {
                return mood;
            }
        }
        console.log('There is no Mood: ' + pName);
        return this._moodlist[0];
    }
}
