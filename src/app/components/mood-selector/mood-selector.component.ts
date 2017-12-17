import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Config} from '../../config';
import {Moods} from '../../models/moods';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'mood-selector',
    styleUrls: ['./mood-selector.component.scss'],
    templateUrl: './mood-selector.component.html',
})
export class MoodSelectorComponent implements OnChanges {

    public arousalLowerLimit: number = Config.arousalLowerLimit;
    public arousalUpperLimit: number = Config.arousalUpperLimit;
    public valencelLowerLimit: number = Config.valenceLowerLimit;
    public valenceUpperLimit: number = Config.valenceUpperLimit;

    public moods: Moods;

    @Input()
    public arousal: number;

    @Input()
    public valence: number;

    @Output()
    public valenceChange: EventEmitter<number> = new EventEmitter();

    @Output()
    public arousalChange: EventEmitter<number> = new EventEmitter();


    public selMoodName: string;

    constructor(translateService: TranslateService) {
        this.moods = new Moods(translateService);
        this.arousal = 0;
        this.valence = 0;
        this.selMoodName = this.moods.getMood(this.arousal, this.valence).name;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.selMoodName = this.moods.getMood(this.arousal, this.valence).name;
    }

    public updateSlider(): void {
        this.arousal = this.moods.getAV(this.selMoodName).arousal;
        this.valence = this.moods.getAV(this.selMoodName).valence;
        this.valenceChange.emit(this.valence);
        this.arousalChange.emit(this.arousal);
    }

    public updateSelector(): void {
        this.selMoodName = this.moods.getMood(this.arousal, this.valence).name;
        this.valenceChange.emit(this.valence);
        this.arousalChange.emit(this.arousal);
    }
}

