import {Component, EventEmitter, Output} from '@angular/core';
import {Config} from '../../config';
import {Mood} from '../../models/mood';
import {Moods} from '../../models/moods';


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

    public moods: Moods;
    public moodList: Mood[] = [];
    public selArousal: number;
    public selValence: number;
    public selMoodName: string;

    @Output()
    public selMood: EventEmitter<Mood> = new EventEmitter<Mood>();

    constructor() {
        this.moods = new Moods();
        this.moodList = this.moods.moodlist;
        this.selArousal = 0;
        this.selValence = 0;
        this.selMoodName = this.moods.getMood(this.selArousal, this.selValence).name;
    }

    public updateSlider(): void {
        this.selArousal = this.moods.getAV(this.selMoodName).arousal;
        this.selValence = this.moods.getAV(this.selMoodName).valence;
        this.selMood.emit(this.moods.getAV(this.selMoodName));
    }

    public updateSelecter(): void {
        this.selMoodName = this.moods.getMood(this.selArousal, this.selValence).name;
        this.selMood.emit(this.moods.getMood(this.selArousal, this.selValence));
    }

}

