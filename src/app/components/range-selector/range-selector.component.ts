import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'range-selector',
    styleUrls: ['./range-selector.component.scss'],
    templateUrl: './range-selector.component.html',
})

export class RangeSelectorComponent implements OnInit {

    @Input()
    public minLimit: number;

    @Input()
    public maxLimit: number;

    @Input()
    public step: number;

    @Input()
    public minValue: number;

    @Input()
    public maxValue: number;

    @Input()
    public minLabel: string;

    @Input()
    public maxLabel: string;

    @Output()
    public minValueChange: EventEmitter<any> = new EventEmitter();

    @Output()
    public maxValueChange: EventEmitter<any> = new EventEmitter();

    constructor() {

    }

    public ngOnInit(): void {
        if (this.minValue == null) {
            this.minValue = this.minLimit;
        }

        if (this.maxValue == null) {
            this.maxValue = this.maxLimit;
        }
        this.updateValues();
    }

    public updateValuesMin(): void {
        if (this.maxValue < this.minValue) {
            this.maxValue = this.minValue;
        }
        this.updateValues();
    }

    public updateValuesMax(): void {
        if (this.minValue > this.maxValue) {
            this.minValue = this.maxValue;
        }
        this.updateValues();
    }

    public updateValues(): void {
        this.minValueChange.emit(this.minValue);
        this.maxValueChange.emit(this.maxValue);
    }

    public getMinValue(): number {
        if (this.minValue) {
            return Math.max(this.minLimit, this.minValue);
        } else {
            return this.minLimit;
        }
    }


    public getMaxValue(): number {
        if (this.maxValue) {
            return Math.min(this.maxLimit, this.maxValue);
        } else {
            return this.maxLimit;
        }
    }
}

