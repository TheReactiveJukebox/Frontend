import {Component, EventEmitter} from '@angular/core';
import {Mood} from '../../models/mood';
import {Moods} from '../../models/moods';
import {Config} from '../../config';


@Component({
    selector: 'mood-selector',
    styleUrls: ['./mood-selector.component.scss'],
    templateUrl: './mood-selector.component.html',
})

export class MoodSelectorComponent {

    public arousalLowerLimit: number = Config.arousalLowerLimit;
    public arousalUpperLimit: number = Config.arousalUpperLimit;
    public valencelLowerLimit: number = Config.valenceLowerLimit;
    public valenceUpperLimit: number = Config.valenceUpperLimit;


    moods: Moods;
    moodList: Mood[] = [];
    selArousal: number;
    selValence: number;
    selMood: string;

    constructor() {
        this.moods = new Moods();
        this.moodList = this.moods.moodlist;
        this.selArousal = 0;
        this.selValence = 0;
        this.selMood = this.moods.getMood(this.selArousal, this.selValence).name;
    }

    public updateSlider(): void {
        this.selArousal = this.moods.getAV(this.selMood).arousal;
        this.selValence = this.moods.getAV(this.selMood).valence;

    }

    public updateSelecter(): void {
        this.selMood = this.moods.getMood(this.selArousal, this.selValence).name;

    }



}

