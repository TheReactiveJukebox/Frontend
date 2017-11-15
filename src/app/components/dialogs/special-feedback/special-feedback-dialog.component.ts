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

    public btnLikeTitle(): void {
        this.cFeedback.songFeedback = 1;
    }

    public btnDislikeTitle(): void {
        this.cFeedback.songFeedback = -1;
    }

    public btnLikeMood(): void {
        this.cFeedback.moodFeedback = 1;
    }

    public btnDislikeMood(): void {
        this.cFeedback.moodFeedback = -1;
    }

    public btnLikeDynamics(): void {
        this.cFeedback.dynamicsFeedback = 1;
    }

    public btnDislikeDynamics(): void {
        this.cFeedback.dynamicsFeedback = -1;
    }

    public btnLikeSpeed(): void {
        this.cFeedback.speedFeedback = 1;
    }

    public btnDislikeSpeed(): void {
        this.cFeedback.speedFeedback = -1;
    }

    public round(value: number, digits: number): number {
        value = value * Math.pow(10, digits);
        value = Math.round(value);
        value = value / Math.pow(10, digits);
        return value;
    }
}
