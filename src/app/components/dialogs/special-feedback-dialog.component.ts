import {Component} from '@angular/core';
import {Track} from '../../models/track';
import {MdDialogRef} from '@angular/material';
import {FeedbackService} from '../../services/feedback.service';

@Component({
    selector: 'special-feedback-dialog',
    templateUrl: 'special-feedback-dialog.component.html',
})
export class SpecialFeedbackDialogComponent {
    cTrack: Track;

    constructor(public dialogRef: MdDialogRef<SpecialFeedbackDialogComponent>,
                //TODO: How to do that?
                //public feedbackService: FeedbackService
    ) {
    }

    btnLikeArtist() {
        this.feedbackService.likeCurrentArtist();
    }

    btnDislikeArtist() {
        this.feedbackService.dislikeCurrentArtist();
    }

    btnLikeGenre() {
        this.feedbackService.likeCurrentGenre();
    }

    btnDislikeGenre() {
        this.feedbackService.dislikeCurrentGenre();
    }

    btnLikeTitle() {
        this.feedbackService.likeCurrentSong();
    }

    btnDislikeTitle() {
        this.feedbackService.dislikeCurrentSong();
    }

    btnLikePeriod() {
        this.feedbackService.likeCurrentPeriod();
    }

    btnDislikePeriod() {
        this.feedbackService.dislikeCurrentPeriod();
    }

    btnLikeMood() {
        this.feedbackService.likeCurrentMood();
    }

    btnDislikeMood() {
        this.feedbackService.dislikeCurrentMood();
    }

    btnLikeDynamics() {
        this.feedbackService.likeCurrentDynamics();
    }

    btnDislikeDynamics() {
        this.feedbackService.dislikeCurrentDynamics();
    }

    btnLikeSpeed() {
        this.feedbackService.likeCurrentSpeed();
    }

    btnDislikeSpeed() {
        this.feedbackService.dislikeCurrentSpeed();
    }

    confirmDialog() {
        this.feedbackService.sendCurrentTrackFeedback();
    }

    confirmAndApplyDialog() {
        this.feedbackService.sendCurrentTrackFeedback();
        //TODO Apply
    }

    closeDialog() {
        this.feedbackService.undoFeedback();
    }
}
