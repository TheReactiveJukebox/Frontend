import {Component} from '@angular/core';
import {Track} from '../../../models/track';
import {TrackFeedback} from '../../../models/trackFeedback';

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
        this.cFeedback.artistLiked = true;
        if (this.cFeedback.artistDisliked) {
            //We don't know if the user dislikes the artist
            this.cFeedback.artistDisliked = null;
        }
    }

    btnDislikeArtist() {
        this.cFeedback.artistDisliked = true;
        if (this.cFeedback.artistLiked) {
            //We don't know if the user likes the artist
            this.cFeedback.artistLiked = null;
        }
    }

    btnLikeGenre() {
        this.cFeedback.genreLiked = true;
        if (this.cFeedback.genreDisliked) {
            //We don't know if the user dislikes the genre
            this.cFeedback.genreDisliked = null;
        }
    }

    btnDislikeGenre() {
        this.cFeedback.genreDisliked = true;
        if (this.cFeedback.genreLiked) {
            //We don't know if the user likes the genre
            this.cFeedback.genreLiked = null;
        }
    }

    btnLikeTitle() {
        this.cFeedback.songLiked = true;
        if (this.cFeedback.songDisliked) {
            //We don't know if the user dislikes the song
            this.cFeedback.songDisliked = null;
        }
    }

    btnDislikeTitle() {
        this.cFeedback.songDisliked = true;
        if (this.cFeedback.songLiked) {
            //We don't know if the user likes the song
            this.cFeedback.songLiked = null;
        }
    }

    btnLikePeriod() {
        this.cFeedback.periodLiked = true;
        if (this.cFeedback.periodDisliked) {
            //We don't know if the user dislikes the period
            this.cFeedback.periodDisliked = null;
        }
    }

    btnDislikePeriod() {
        this.cFeedback.periodDisliked = true;
        if (this.cFeedback.periodLiked) {
            //We don't know if the user likes the period
            this.cFeedback.periodLiked = null;
        }
    }

    btnLikeMood() {
        this.cFeedback.moodLiked = true;
        if (this.cFeedback.moodDisliked) {
            //We don't know if the user dislikes the mood
            this.cFeedback.moodDisliked = null;
        }
    }

    btnDislikeMood() {
        this.cFeedback.moodDisliked = true;
        if (this.cFeedback.moodLiked) {
            //We don't know if the user likes the mood
            this.cFeedback.moodLiked = null;
        }
    }

    btnLikeDynamics() {
        this.cFeedback.dynamicsLiked = true;
        if (this.cFeedback.dynamicsDisliked) {
            //We don't know if the user dislikes the dynamics
            this.cFeedback.dynamicsDisliked = null;
        }
    }

    btnDislikeDynamics() {
        this.cFeedback.dynamicsDisliked = true;
        if (this.cFeedback.dynamicsLiked) {
            //We don't know if the user likes the dynamics
            this.cFeedback.dynamicsLiked = null;
        }
    }

    btnLikeSpeed() {
        this.cFeedback.speedLiked = true;
        if (this.cFeedback.speedDisliked) {
            //We don't know if the user dislikes the speed
            this.cFeedback.speedDisliked = null;
        }
    }

    btnDislikeSpeed() {
        this.cFeedback.speedDisliked = true;
        if (this.cFeedback.speedLiked) {
            //We don't know if the user likes the speed
            this.cFeedback.speedLiked = null;
        }
    }
}
