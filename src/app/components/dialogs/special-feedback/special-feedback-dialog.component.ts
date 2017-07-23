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
    toggleButtonLikeArtistClass: string = 'reducedFeedback-like-artist-toggle-off';
    toggleButtonDislikeArtistClass: string = 'reducedFeedback-dislike-artist-toggle-off';
    toggleButtonLikeGenreClass: string = 'reducedFeedback-like-genre-toggle-off';
    toggleButtonDislikeGenreClass: string = 'reducedFeedback-dislike-genre-toggle-off';
    toggleButtonLikeTitleClass: string = 'reducedFeedback-like-title-toggle-off';
    toggleButtonDislikeTitleClass: string = 'reducedFeedback-dislike-title-toggle-off';
    toggleButtonLikePeriodClass: string = 'reducedFeedback-like-period-toggle-off';
    toggleButtonDislikePeriodClass: string = 'reducedFeedback-dislike-period-toggle-off';
    toggleButtonLikeMoodClass: string = 'reducedFeedback-like-mood-toggle-off';
    toggleButtonDislikeMoodClass: string = 'reducedFeedback-dislike-mood-toggle-off';
    toggleButtonLikeDynamicsClass: string = 'reducedFeedback-like-dynamics-toggle-off';
    toggleButtonDislikeDynamicsClass: string = 'reducedFeedback-dislike-dynamics-toggle-off';
    toggleButtonLikeSpeedClass: string = 'reducedFeedback-like-speed-toggle-off';
    toggleButtonDislikeSpeedClass: string = 'reducedFeedback-dislike-speed-toggle-off';


    constructor() {
    }

    btnLikeArtist() {
        this.cFeedback.artistLiked = true;
        this.toggleButtonLikeArtistClass = 'feedback-like-artist-toggle-on';
        this.toggleButtonDislikeArtistClass = 'feedback-dislike-artist-toggle-off';
        if (this.cFeedback.artistDisliked) {
            //We don't know if the user dislikes the artist
            this.cFeedback.artistDisliked = null;
        }
    }

    btnDislikeArtist() {
        this.cFeedback.artistDisliked = true;
        this.toggleButtonDislikeArtistClass = 'feedback-dislike-artist-toggle-on';
        this.toggleButtonLikeArtistClass = 'feedback-like-artist-toggle-off';
        if (this.cFeedback.artistLiked) {
            //We don't know if the user likes the artist
            this.cFeedback.artistLiked = null;
        }
    }

    btnLikeGenre() {
        this.cFeedback.genreLiked = true;
        this.toggleButtonLikeGenreClass = 'feedback-like-genre-toggle-on';
        this.toggleButtonDislikeGenreClass = 'feedback-dislike-genre-toggle-off';
        if (this.cFeedback.genreDisliked) {
            //We don't know if the user dislikes the genre
            this.cFeedback.genreDisliked = null;
        }
    }

    btnDislikeGenre() {
        this.cFeedback.genreDisliked = true;
        this.toggleButtonDislikeGenreClass = 'feedback-dislike-genre-toggle-on';
        this.toggleButtonLikeGenreClass = 'feedback-like-genre-toggle-off';
        if (this.cFeedback.genreLiked) {
            //We don't know if the user likes the genre
            this.cFeedback.genreLiked = null;
        }
    }

    btnLikeTitle() {
        this.cFeedback.songLiked = true;
        this.toggleButtonLikeTitleClass = 'feedback-like-title-toggle-on';
        this.toggleButtonDislikeTitleClass = 'feedback-dislike-title-toggle-off';
        if (this.cFeedback.songDisliked) {
            //We don't know if the user dislikes the song
            this.cFeedback.songDisliked = null;
        }
    }

    btnDislikeTitle() {
        this.cFeedback.songDisliked = true;
        this.toggleButtonDislikeTitleClass = 'feedback-dislike-title-toggle-on';
        this.toggleButtonLikeTitleClass = 'feedback-like-title-toggle-off';
        if (this.cFeedback.songLiked) {
            //We don't know if the user likes the song
            this.cFeedback.songLiked = null;
        }
    }

    btnLikePeriod() {
        this.cFeedback.periodLiked = true;
        this.toggleButtonLikePeriodClass = 'feedback-like-period-toggle-on';
        this.toggleButtonDislikePeriodClass = 'feedback-dislike-period-toggle-off';
        if (this.cFeedback.periodDisliked) {
            //We don't know if the user dislikes the period
            this.cFeedback.periodDisliked = null;
        }
    }

    btnDislikePeriod() {
        this.cFeedback.periodDisliked = true;
        this.toggleButtonDislikePeriodClass = 'feedback-dislike-period-toggle-on';
        this.toggleButtonLikePeriodClass = 'feedback-like-period-toggle-off';
        if (this.cFeedback.periodLiked) {
            //We don't know if the user likes the period
            this.cFeedback.periodLiked = null;
        }
    }

    btnLikeMood() {
        this.cFeedback.moodLiked = true;
        this.toggleButtonLikeMoodClass = 'feedback-like-mood-toggle-on';
        this.toggleButtonDislikeMoodClass = 'feedback-dislike-mood-toggle-off';
        if (this.cFeedback.moodDisliked) {
            //We don't know if the user dislikes the mood
            this.cFeedback.moodDisliked = null;
        }
    }

    btnDislikeMood() {
        this.cFeedback.moodDisliked = true;
        this.toggleButtonDislikeMoodClass = 'feedback-dislike-mood-toggle-on';
        this.toggleButtonLikeMoodClass = 'feedback-like-mood-toggle-off';
        if (this.cFeedback.moodLiked) {
            //We don't know if the user likes the mood
            this.cFeedback.moodLiked = null;
        }
    }

    btnLikeDynamics() {
        this.cFeedback.dynamicsLiked = true;
        this.toggleButtonLikeDynamicsClass = 'feedback-like-dynamics-toggle-on';
        this.toggleButtonDislikeDynamicsClass = 'feedback-dislike-dynamics-toggle-off';
        if (this.cFeedback.dynamicsDisliked) {
            //We don't know if the user dislikes the dynamics
            this.cFeedback.dynamicsDisliked = null;
        }
    }

    btnDislikeDynamics() {
        this.cFeedback.dynamicsDisliked = true;
        this.toggleButtonDislikeDynamicsClass = 'feedback-dislike-dynamics-toggle-on';
        this.toggleButtonLikeDynamicsClass = 'feedback-like-dynamics-toggle-off';
        if (this.cFeedback.dynamicsLiked) {
            //We don't know if the user likes the dynamics
            this.cFeedback.dynamicsLiked = null;
        }
    }

    btnLikeSpeed() {
        this.cFeedback.speedLiked = true;
        this.toggleButtonLikeSpeedClass = 'feedback-like-speed-toggle-on';
        this.toggleButtonDislikeSpeedClass = 'feedback-dislike-speed-toggle-off';
        if (this.cFeedback.speedDisliked) {
            //We don't know if the user dislikes the speed
            this.cFeedback.speedDisliked = null;
        }
    }

    btnDislikeSpeed() {
        this.cFeedback.speedDisliked = true;
        this.toggleButtonDislikeSpeedClass = 'feedback-dislike-speed-toggle-on';
        this.toggleButtonLikeSpeedClass = 'feedback-like-speed-toggle-off';
        if (this.cFeedback.speedLiked) {
            //We don't know if the user likes the speed
            this.cFeedback.speedLiked = null;
        }
    }
}
