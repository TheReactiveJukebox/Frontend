import {Mood} from './mood';

export class Moods {

    private _moodlist: Mood[] = [];


    constructor() {
        this._moodlist.push(new Mood( 0, 'neutral', 0, 0));
        this._moodlist.push(new Mood( 1, 'happy', 0.15, 0.9));
        this._moodlist.push(new Mood( 2, 'joyous', 0.12, 0.95));
        this._moodlist.push(new Mood( 3, 'interested', 0.02, 0.65));
        this._moodlist.push(new Mood( 4, 'expectant', 0.05, 0.31));
        this._moodlist.push(new Mood( 5, 'passionate', 0.12, 0.95));
        this._moodlist.push(new Mood( 6, 'amused', 0.2, 0.55));
        this._moodlist.push(new Mood( 7, 'determined', 0.25, 0.73));
        this._moodlist.push(new Mood( 8, 'enthusiastic', 0.32, 0.5));
        this._moodlist.push(new Mood( 9, 'delighted', 0.35, 0.88));
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
        this._moodlist.push(new Mood(31, 'hateful', 0.85, -0.59));
        this._moodlist.push(new Mood(32, 'defiant', 0.72, -0.6));
        this._moodlist.push(new Mood(33, 'contemptuous', 0.65, -0.58));
        this._moodlist.push(new Mood(34, 'annoyed', 0.65, -0.45));
        this._moodlist.push(new Mood(35, 'jealous', 0.55, -0.08));
        this._moodlist.push(new Mood(36, 'distressed', 0.55, -0.7));
        this._moodlist.push(new Mood(37, 'disgusted', 0.5, -0.66));
        this._moodlist.push(new Mood(38, 'loathing', 0.42, -0.8));
        this._moodlist.push(new Mood(39, 'frustrated', 0.39, -0.59));
        this._moodlist.push(new Mood(40, 'indignant', 0.45, -0.24));
        this._moodlist.push(new Mood(41, 'impatient', 0.29, -0.05));
        this._moodlist.push(new Mood(42, 'suspicious', 0.25, -0.31));
        this._moodlist.push(new Mood(43, 'discontented', 0.32, -0.66));
        this._moodlist.push(new Mood(44, 'bitter', 0.25, -0.8));
        this._moodlist.push(new Mood(45, 'insulted', 0.2, -0.74));
        this._moodlist.push(new Mood(46, 'distrustful', 0.1, -0.48));
        this._moodlist.push(new Mood(47, 'startled', 0.03, -0.91));
        this._moodlist.push(new Mood(48, 'disappointed', -0.04, -0.8));
        this._moodlist.push(new Mood(49, 'miserable', -0.13, -0.92));
        this._moodlist.push(new Mood(50, 'dissatisfied', -0.17, -0.6));
        this._moodlist.push(new Mood(51, 'taken_aback', -0.23, -0.41));
        this._moodlist.push(new Mood(52, 'apathetic', -0.13, -0.2));
        this._moodlist.push(new Mood(53, 'worried', -0.33, -0.08));
        this._moodlist.push(new Mood(54, 'feel_guilt', -0.43, -0.4));
        this._moodlist.push(new Mood(55, 'despondent', -0.43, -0.57));
        this._moodlist.push(new Mood(56, 'uncomfortable', -0.37, -0.68));
        this._moodlist.push(new Mood(57, 'sad', -0.4, -0.82));
        this._moodlist.push(new Mood(58, 'depressed', -0.47, -0.81));
        this._moodlist.push(new Mood(59, 'gloomy', -0.47, -0.87));
        this._moodlist.push(new Mood(60, 'desperate', -0.5, -0.8));
        this._moodlist.push(new Mood(61, 'ashamed', -0.5, -0.45));
        this._moodlist.push(new Mood(62, 'languid', -0.5, -0.23));
        this._moodlist.push(new Mood(63, 'embarrassed', -0.6, -0.32));
        this._moodlist.push(new Mood(64, 'melancholic', -0.66, -0.04));
        this._moodlist.push(new Mood(65, 'hesitant', -0.73, -0.31));
        this._moodlist.push(new Mood(66, 'wavering', -0.7, -0.57));
        this._moodlist.push(new Mood(67, 'anxious', -0.8, -0.72));
        this._moodlist.push(new Mood(68, 'dejected', -0.85, -0.5));
        this._moodlist.push(new Mood(69, 'bored', -0.79, -0.35));
        this._moodlist.push(new Mood(70, 'droopy', -0.93, -0.32));
        this._moodlist.push(new Mood(71, 'doubtful', -0.96, -0.28));
        this._moodlist.push(new Mood(72, 'tired', -0.99, -0.02));
        this._moodlist.push(new Mood(73, 'sleepy', -0.99, 0.03));
        this._moodlist.push(new Mood(74, 'reverent', -0.97, 0.22));
        this._moodlist.push(new Mood(75, 'compassionate', -0.93, 0.37));
        this._moodlist.push(new Mood(76, 'conscientious', -0.79, 0.32));
        this._moodlist.push(new Mood(77, 'serious', -0.66, 0.22));
        this._moodlist.push(new Mood(78, 'pensive', -0.6, 0.04));
        this._moodlist.push(new Mood(79, 'longing', -0.43, 0.22));
        this._moodlist.push(new Mood(80, 'attentive', -0.46, 0.48));
        this._moodlist.push(new Mood(81, 'contemplative', -0.6, 0.58));
        this._moodlist.push(new Mood(82, 'polite', -0.66, 0.37));
        this._moodlist.push(new Mood(83, 'peaceful', -0.79, 0.55));
        this._moodlist.push(new Mood(84, 'relaxed', -0.66, 0.72));
        this._moodlist.push(new Mood(85, 'satisfied', -0.63, 0.78));
        this._moodlist.push(new Mood(86, 'friendly', -0.6, 0.76));
        this._moodlist.push(new Mood(87, 'at_ease', -0.6, 0.78));
        this._moodlist.push(new Mood(88, 'content', -0.56, 0.82));
        this._moodlist.push(new Mood(89, 'serene', -0.5, 0.84));
        this._moodlist.push(new Mood(90, 'solemn', -0.47, 0.82));
        this._moodlist.push(new Mood(91, 'hopeful', -0.3, 0.62));
        this._moodlist.push(new Mood(92, 'confident', -0.2, 0.51));
        this._moodlist.push(new Mood(93, 'amorous', -0.14, 0.85));
        this._moodlist.push(new Mood(94, 'glad', -0.16, 0.95));
        this._moodlist.push(new Mood(95, 'pleased', -0.1, 0.88));
        this._moodlist.push(new Mood(96, 'feel_well', -0.07, 0.92));
        this._moodlist.push(new Mood(97, 'impressed', -0.07, 0.38));

        this.printMoodList();

    }

    private printMoodList(): void {
        for (let m of this._moodlist) {
            //"NEUTRAL": "neutral",
            console.log('"' + m.name.toLocaleUpperCase() + '": "' + m.name + '",');
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
