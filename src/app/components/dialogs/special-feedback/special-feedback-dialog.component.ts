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

    btnLikeArtist() {
        this.cFeedback.artistFeedback = 1;
    }

    btnDislikeArtist() {
        this.cFeedback.artistFeedback = -1;
    }

    btnLikeGenre() {
        this.cFeedback.genreFeedback = [{genre: this.cTrack.genres[0], feedback: 1}];
    }

    btnDislikeGenre() {
        this.cFeedback.genreFeedback = [{genre: this.cTrack.genres[0], feedback: -1}];
    }

    btnLikeTitle() {
        this.cFeedback.songFeedback = 1;
    }

    btnDislikeTitle() {
        this.cFeedback.songFeedback = -1;
    }

    btnLikeMood() {
        this.cFeedback.moodFeedback = 1;
    }

    btnDislikeMood() {
        this.cFeedback.moodFeedback = -1;
    }

    btnLikeDynamics() {
        this.cFeedback.dynamicsFeedback = 1;
    }

    btnDislikeDynamics() {
        this.cFeedback.dynamicsFeedback = -1;
    }

    btnLikeSpeed() {
        this.cFeedback.speedFeedback = 1;
    }

    btnDislikeSpeed() {
        this.cFeedback.speedFeedback = -1;
    }

    public round(value: number, digits: number): number {
        value = value * Math.pow(10, digits);
        value = Math.round(value);
        value = value / Math.pow(10, digits);
        return value;
    }
}
