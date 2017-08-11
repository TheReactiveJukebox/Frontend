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
        if (this.cFeedback.artistLiked) {
            this.cFeedback.artistLiked = false;
            this.toggleButtonLikeArtistClass = 'feedback-like-artist-toggle-off';
        } else {
            this.cFeedback.artistLiked = true;
            this.toggleButtonLikeArtistClass = 'feedback-like-artist-toggle-on';
            if (this.cFeedback.artistDisliked) {
                this.cFeedback.artistDisliked = false;
                this.toggleButtonDislikeArtistClass = 'feedback-dislike-artist-toggle-off';
            }
        }
    }

    btnDislikeArtist() {
        if (this.cFeedback.artistDisliked) {
            this.cFeedback.artistDisliked = false;
            this.toggleButtonDislikeArtistClass = 'feedback-dislike-artist-toggle-off';
        } else {
            this.cFeedback.artistDisliked = true;
            this.toggleButtonDislikeArtistClass = 'feedback-dislike-artist-toggle-on';
            if (this.cFeedback.artistLiked) {
                this.cFeedback.artistLiked = false;
                this.toggleButtonLikeArtistClass = 'feedback-dislike-artist-toggle-off';
            }
        }
    }

    btnLikeGenre() {
        if (this.cFeedback.genreLiked) {
            this.cFeedback.genreLiked = false;
            this.toggleButtonLikeGenreClass = 'feedback-like-genre-toggle-off';
        } else {
            this.cFeedback.genreLiked = true;
            this.toggleButtonLikeGenreClass = 'feedback-like-genre-toggle-on';
            if (this.cFeedback.genreDisliked) {
                this.cFeedback.genreDisliked = false;
                this.toggleButtonDislikeGenreClass = 'feedback-dislike-genre-toggle-off';
            }
        }
    }

    btnDislikeGenre() {
        if (this.cFeedback.genreDisliked) {
            this.cFeedback.genreDisliked = false;
            this.toggleButtonDislikeGenreClass = 'feedback-dislike-genre-toggle-off';
        } else {
            this.cFeedback.genreDisliked = true;
            this.toggleButtonDislikeGenreClass = 'feedback-dislike-genre-toggle-on';
            if (this.cFeedback.genreLiked) {
                this.cFeedback.genreLiked = false;
                this.toggleButtonLikeGenreClass = 'feedback-dislike-genre-toggle-off';
            }
        }
    }

    btnLikeTitle() {
        if (this.cFeedback.songLiked) {
            this.cFeedback.songLiked = false;
            this.toggleButtonLikeTitleClass = 'feedback-like-title-toggle-off';
        } else {
            this.cFeedback.songLiked = true;
            this.toggleButtonLikeTitleClass = 'feedback-like-title-toggle-on';
            if (this.cFeedback.songDisliked) {
                this.cFeedback.songDisliked = false;
                this.toggleButtonDislikeTitleClass = 'feedback-dislike-title-toggle-off';
            }
        }
    }

    btnDislikeTitle() {
        if (this.cFeedback.songDisliked) {
            this.cFeedback.songDisliked = false;
            this.toggleButtonDislikeTitleClass = 'feedback-dislike-title-toggle-off';
        } else {
            this.cFeedback.songDisliked = true;
            this.toggleButtonDislikeTitleClass = 'feedback-dislike-title-toggle-on';
            if (this.cFeedback.songLiked) {
                this.cFeedback.songLiked = false;
                this.toggleButtonLikeTitleClass = 'feedback-dislike-title-toggle-off';
            }
        }
    }

    btnLikePeriod() {
        if (this.cFeedback.periodLiked) {
            this.cFeedback.periodLiked = false;
            this.toggleButtonLikePeriodClass = 'feedback-like-period-toggle-off';
        } else {
            this.cFeedback.periodLiked = true;
            this.toggleButtonLikePeriodClass = 'feedback-like-period-toggle-on';
            if (this.cFeedback.periodDisliked) {
                this.cFeedback.periodDisliked = false;
                this.toggleButtonDislikePeriodClass = 'feedback-dislike-period-toggle-off';
            }
        }
    }

    btnDislikePeriod() {
        if (this.cFeedback.periodDisliked) {
            this.cFeedback.periodDisliked = false;
            this.toggleButtonDislikePeriodClass = 'feedback-dislike-period-toggle-off';
        } else {
            this.cFeedback.periodDisliked = true;
            this.toggleButtonDislikePeriodClass = 'feedback-dislike-period-toggle-on';
            if (this.cFeedback.periodLiked) {
                this.cFeedback.periodLiked = false;
                this.toggleButtonLikePeriodClass = 'feedback-dislike-period-toggle-off';
            }
        }
    }

    btnLikeMood() {
        if (this.cFeedback.moodLiked) {
            this.cFeedback.moodLiked = false;
            this.toggleButtonLikeMoodClass = 'feedback-like-mood-toggle-off';
        } else {
            this.cFeedback.moodLiked = true;
            this.toggleButtonLikeMoodClass = 'feedback-like-mood-toggle-on';
            if (this.cFeedback.moodDisliked) {
                this.cFeedback.moodDisliked = false;
                this.toggleButtonDislikeMoodClass = 'feedback-dislike-mood-toggle-off';
            }
        }
    }

    btnDislikeMood() {
        if (this.cFeedback.moodDisliked) {
            this.cFeedback.moodDisliked = false;
            this.toggleButtonDislikeMoodClass = 'feedback-dislike-mood-toggle-off';
        } else {
            this.cFeedback.moodDisliked = true;
            this.toggleButtonDislikeMoodClass = 'feedback-dislike-mood-toggle-on';
            if (this.cFeedback.moodLiked) {
                this.cFeedback.moodLiked = false;
                this.toggleButtonLikeMoodClass = 'feedback-dislike-mood-toggle-off';
            }
        }
    }

    btnLikeDynamics() {
        if (this.cFeedback.dynamicsLiked) {
            this.cFeedback.dynamicsLiked = false;
            this.toggleButtonLikeDynamicsClass = 'feedback-like-dynamics-toggle-off';
        } else {
            this.cFeedback.dynamicsLiked = true;
            this.toggleButtonLikeDynamicsClass = 'feedback-like-dynamics-toggle-on';
            if (this.cFeedback.dynamicsDisliked) {
                this.cFeedback.dynamicsDisliked = false;
                this.toggleButtonDislikeDynamicsClass = 'feedback-dislike-dynamics-toggle-off';
            }
        }
    }

    btnDislikeDynamics() {
        if (this.cFeedback.dynamicsDisliked) {
            this.cFeedback.dynamicsDisliked = false;
            this.toggleButtonDislikeDynamicsClass = 'feedback-dislike-dynamics-toggle-off';
        } else {
            this.cFeedback.dynamicsDisliked = true;
            this.toggleButtonDislikeDynamicsClass = 'feedback-dislike-dynamics-toggle-on';
            if (this.cFeedback.dynamicsLiked) {
                this.cFeedback.dynamicsLiked = false;
                this.toggleButtonLikeDynamicsClass = 'feedback-dislike-dynamics-toggle-off';
            }
        }
    }

    btnLikeSpeed() {
        if (this.cFeedback.speedLiked) {
            this.cFeedback.speedLiked = false;
            this.toggleButtonLikeSpeedClass = 'feedback-like-speed-toggle-off';
        } else {
            this.cFeedback.speedLiked = true;
            this.toggleButtonLikeSpeedClass = 'feedback-like-speed-toggle-on';
            if (this.cFeedback.speedDisliked) {
                this.cFeedback.speedDisliked = false;
                this.toggleButtonDislikeSpeedClass = 'feedback-dislike-speed-toggle-off';
            }
        }
    }

    btnDislikeSpeed() {
        if (this.cFeedback.speedDisliked) {
            this.cFeedback.speedDisliked = false;
            this.toggleButtonDislikeSpeedClass = 'feedback-dislike-speed-toggle-off';
        } else {
            this.cFeedback.speedDisliked = true;
            this.toggleButtonDislikeSpeedClass = 'feedback-dislike-speed-toggle-on';
            if (this.cFeedback.speedLiked) {
                this.cFeedback.speedLiked = false;
                this.toggleButtonLikeSpeedClass = 'feedback-dislike-speed-toggle-off';
            }
        }
    }
}
