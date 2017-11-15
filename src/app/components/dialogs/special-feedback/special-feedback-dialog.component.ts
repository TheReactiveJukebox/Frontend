import {Component} from '@angular/core';
import {Track} from '../../../models/track';
import {TrackFeedback} from '../../../models/track-feedback';

@Component({
    selector: 'special-feedback-dialog',
    templateUrl: './special-feedback-dialog.component.html',
    styleUrls: ['./special-feedback-dialog.component.scss']
})
export class SpecialFeedbackDialogComponent {
    public cTrack: Track;
    public cFeedback: TrackFeedback;

    constructor() {
    }

    public round(value: number, digits: number): number {
        value = value * Math.pow(10, digits);
        value = Math.round(value);
        value = value / Math.pow(10, digits);
        return value;
    }
}
