import {Component} from '@angular/core';
import {Track} from '../../models/track';
import {TrackFeedback} from '../../models/trackFeedback';
import {FeedbackService} from '../../services/feedback.service';

@Component({
    selector: 'special-feedback-dialog',
    templateUrl: './special-feedback-dialog.component.html',
    styleUrls: ['./special-feedback-dialog.component.scss']
})
export class SpecialFeedbackDialogComponent {
    cTrack: Track;
    cFeedback: TrackFeedback;

    constructor(public feedbackService: FeedbackService) {
    }


    btnLikeArtist() {
        this.cFeedback = this.feedbackService.likeArtist(this.cFeedback);
    }

    btnDislikeArtist() {
        this.cFeedback = this.feedbackService.dislikeArtist(this.cFeedback);
    }

    btnLikeGenre() {
        this.cFeedback = this.feedbackService.likeGenre(this.cFeedback);
    }

    btnDislikeGenre() {
        this.cFeedback = this.feedbackService.dislikeGenre(this.cFeedback);
    }

    btnLikeTitle() {
        this.cFeedback = this.feedbackService.likeSong(this.cFeedback);
    }

    btnDislikeTitle() {
        this.cFeedback = this.feedbackService.dislikeSong(this.cFeedback);
    }

    btnLikePeriod() {
        this.cFeedback = this.feedbackService.likePeriod(this.cFeedback);
    }

    btnDislikePeriod() {
        this.cFeedback = this.feedbackService.dislikePeriod(this.cFeedback);
    }

    btnLikeMood() {
        this.cFeedback = this.feedbackService.likeMood(this.cFeedback);
    }

    btnDislikeMood() {
        this.cFeedback = this.feedbackService.dislikeMood(this.cFeedback);
    }

    btnLikeDynamics() {
        this.cFeedback = this.feedbackService.likeDynamics(this.cFeedback);
    }

    btnDislikeDynamics() {
        this.cFeedback = this.feedbackService.dislikeDynamics(this.cFeedback);
    }

    btnLikeSpeed() {
        this.cFeedback = this.feedbackService.likeSpeed(this.cFeedback);
    }

    btnDislikeSpeed() {
        this.cFeedback = this.feedbackService.dislikeSpeed(this.cFeedback);
    }

    confirmDialog() {
        this.feedbackService.postTrackFeedback(this.cFeedback);
    }

    confirmAndApplyDialog() {
        this.feedbackService.postTrackFeedback(this.cFeedback);
        //TODO Apply
    }

    closeDialog() {

    }
}
