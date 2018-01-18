import {Mood} from './mood';
import {MoodGroups} from './mood-groups';
import {TranslateService} from '@ngx-translate/core';
import {LoggingService} from '../services/logging.service';


export class Moods {

    private _moodlist: Mood[] = [];
    public _moodGroups: MoodGroups[] = [];


    constructor(translationService: TranslateService, private loggingService: LoggingService) {
        //define moods
        this._moodlist.push(new Mood( 0, 'neutral', 0, 0));
        this._moodlist.push(new Mood( 4, 'expectant', 0.05, 0.31));
        this._moodlist.push(new Mood( 6, 'amused', 0.2, 0.55));
        this._moodlist.push(new Mood( 8, 'enthusiastic', 0.32, 0.5));
        this._moodlist.push(new Mood(10, 'light_hearted', 0.3, 0.41));
        this._moodlist.push(new Mood(11, 'convinced', 0.41, 0.41));
        this._moodlist.push(new Mood(12, 'feeling_superior', 0.55, 0.31));
        this._moodlist.push(new Mood(13, 'conceited', 0.65, 0.19));
        this._moodlist.push(new Mood(14, 'ambitious', 0.65, 0.41));
        this._moodlist.push(new Mood(15, 'courageous', 0.59, 0.81));
        this._moodlist.push(new Mood(16, 'selfconfident', 0.65, 0.81));
        this._moodlist.push(new Mood(17, 'excited', 0.71, 0.7));
        this._moodlist.push(new Mood(18, 'triumphant', 0.79, 0.65));
        this._moodlist.push(new Mood(19, 'adventurous', 0.91, 0.49));
        this._moodlist.push(new Mood(20, 'astonished', 0.89, 0.41));
        this._moodlist.push(new Mood(21, 'aroused', 0.91, 0.38));
        this._moodlist.push(new Mood(22, 'lusting', 0.85, 0.22));
        this._moodlist.push(new Mood(23, 'tense', 0.85, -0.01));
        this._moodlist.push(new Mood(24, 'alarmed', 0.89, -0.08));
        this._moodlist.push(new Mood(25, 'bellicose', 0.95, -0.11));
        this._moodlist.push(new Mood(26, 'hostile', 0.89, -0.28));
        this._moodlist.push(new Mood(27, 'envious', 0.82, -0.28));
        this._moodlist.push(new Mood(28, 'afraid', 0.79, -0.11));
        this._moodlist.push(new Mood(29, 'enraged', 0.72, -0.18));
        this._moodlist.push(new Mood(30, 'angry', 0.79, -0.41));
        this._moodlist.push(new Mood(32, 'defiant', 0.72, -0.6));
        this._moodlist.push(new Mood(33, 'contemptuous', 0.65, -0.58));
        this._moodlist.push(new Mood(34, 'annoyed', 0.65, -0.45));
        this._moodlist.push(new Mood(35, 'jealous', 0.55, -0.08));
        this._moodlist.push(new Mood(36, 'distressed', 0.55, -0.7));
        this._moodlist.push(new Mood(37, 'disgusted', 0.5, -0.66));
        this._moodlist.push(new Mood(39, 'frustrated', 0.39, -0.59));
        this._moodlist.push(new Mood(40, 'indignant', 0.45, -0.24));
        this._moodlist.push(new Mood(41, 'impatient', 0.29, -0.05));
        this._moodlist.push(new Mood(42, 'suspicious', 0.25, -0.31));
        this._moodlist.push(new Mood(46, 'distrustful', 0.1, -0.48));
        this._moodlist.push(new Mood(50, 'dissatisfied', -0.17, -0.6));
        this._moodlist.push(new Mood(51, 'taken_aback', -0.23, -0.41));
        this._moodlist.push(new Mood(52, 'apathetic', -0.13, -0.2));
        this._moodlist.push(new Mood(53, 'worried', -0.33, -0.08));
        this._moodlist.push(new Mood(54, 'feel_guilt', -0.43, -0.4));
        this._moodlist.push(new Mood(55, 'despondent', -0.43, -0.57));
        this._moodlist.push(new Mood(56, 'uncomfortable', -0.37, -0.68));
        this._moodlist.push(new Mood(61, 'ashamed', -0.5, -0.45));
        this._moodlist.push(new Mood(62, 'languid', -0.5, -0.23));
        this._moodlist.push(new Mood(63, 'embarrassed', -0.6, -0.32));
        this._moodlist.push(new Mood(65, 'hesitant', -0.73, -0.31));
        this._moodlist.push(new Mood(66, 'wavering', -0.7, -0.57));
        this._moodlist.push(new Mood(97, 'impressed', -0.07, 0.38));


        //init the moodGroups Array
        this._moodGroups = [new MoodGroups('neutral', [], translationService),
                            new MoodGroups('positive', [], translationService),
                            new MoodGroups('active', [], translationService),
                            new MoodGroups('negative', [], translationService),
                            new MoodGroups('passive', [], translationService)];

        //fill the moodGroups Array
        for (let mood of this._moodlist){
            switch (this.getMoodGroup(mood)) {
                case 'neutral': {
                    this._moodGroups[0].addMood(mood);
                    break;
                }
                case 'positive': {
                    this._moodGroups[1].addMood(mood);
                    break;
                }
                case 'active': {
                    this._moodGroups[2].addMood(mood);
                    break;
                }
                case 'negative': {
                    this._moodGroups[3].addMood(mood);
                    break;
                }
                case 'passive': {
                    this._moodGroups[4].addMood(mood);
                    break;
                }
            }

        }

        //sort the moods in each group
        for (let mg of this._moodGroups){
            mg.sortMoods();
        }

    }

    get moodGroups(): MoodGroups[] {
        return this._moodGroups;
    }

    //sort the moods to four groups: aktive, passive, negative and positive
    public getMoodGroup(pMood: Mood): string {
        if (pMood.arousal == 0 && pMood.valence == 0) {
            return 'neutral';
        }else {
            if (pMood.arousal >= 0) {
                if (pMood.arousal >= Math.abs(pMood.valence)) {
                    return 'active';
                }else {
                    if (pMood.valence >= 0) {
                        return 'positive';
                    } else {
                        return 'negative';
                    }
                }
            } else {
                if (Math.abs(pMood.arousal) >=  Math.abs(pMood.valence)) {
                    return 'passive';
                }else {
                    if (pMood.valence >= 0) {
                        return 'positive';
                    } else {
                        return 'negative';
                    }
                }
            }
        }

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

    //return the a/v for given mood tag
    public getAV(pName: string): Mood {
        for (let mood of this._moodlist) {
            if (pName === mood.name) {
                return mood;
            }
        }
        this.loggingService.error(this, 'There is no Mood: ' + pName);
        return this._moodlist[0];
    }
}
