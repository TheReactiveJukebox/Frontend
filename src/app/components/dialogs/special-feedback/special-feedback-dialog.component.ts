import {Component} from '@angular/core';
import {Track} from '../../../models/track';
import {TrackFeedback} from '../../../models/track-feedback';

@Component({
    selector: 'special-feedback-dialog',
    templateUrl: './special-feedback-dialog.component.html',
    styleUrls: ['./special-feedback-dialog.component.scss']
})
export class SpecialFeedbackDialogComponent {
    cTrack: Track;
    cFeedback: TrackFeedback;

    constructor() {
    }

    btnLikeArtist(): void {
        this.cFeedback.artistFeedback = 1;
    }

    btnDislikeArtist(): void {
        this.cFeedback.artistFeedback = -1;
    }

    btnLikeGenre(): void {
        this.cFeedback.genreFeedback = [{genre: this.cTrack.genres[0], feedback: 1}];
    }

    btnDislikeGenre(): void {
        this.cFeedback.genreFeedback = [{genre: this.cTrack.genres[0], feedback: -1}];
    }

    btnLikeTitle(): void {
        this.cFeedback.songFeedback = 1;
    }

    btnDislikeTitle(): void {
        this.cFeedback.songFeedback = -1;
    }

    btnLikeMood(): void {
        this.cFeedback.moodFeedback = 1;
    }

    btnDislikeMood(): void {
        this.cFeedback.moodFeedback = -1;
    }

    btnLikeDynamics(): void {
        this.cFeedback.dynamicsFeedback = 1;
    }

    btnDislikeDynamics(): void {
        this.cFeedback.dynamicsFeedback = -1;
    }

    btnLikeSpeed(): void {
        this.cFeedback.speedFeedback = 1;
    }

    btnDislikeSpeed(): void {
        this.cFeedback.speedFeedback = -1;
    }

    public round(value: number, digits: number): number {
        value = value * Math.pow(10, digits);
        value = Math.round(value);
        value = value / Math.pow(10, digits);
        return value;
    }
}
