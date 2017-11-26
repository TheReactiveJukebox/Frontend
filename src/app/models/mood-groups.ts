import {Mood} from './mood';
import {TranslateService} from '@ngx-translate/core';

export class MoodGroups {
    private _name: string;
    private _moods: Mood[];
    private translateService: TranslateService;


    constructor(pName: string, pMoodList: Mood[], translateService: TranslateService) {
        this._name = pName;
        this._moods = pMoodList;
        this.translateService = translateService;
    }

    public addMood(pMood: Mood): void {
        this._moods.push(pMood);
    }

    public sortMoods(): void {
        //sort moods alphabeticaly by current language
        this._moods.sort((a: Mood, b: Mood) => this.translateService.instant('MOODS.' + a.name.toUpperCase()).
        localeCompare(this.translateService.instant('MOODS.' + b.name.toUpperCase())));

    }

    get name(): string {
        return this._name;
    }

    get moods(): Mood[] {
        return this._moods;
    }
}
