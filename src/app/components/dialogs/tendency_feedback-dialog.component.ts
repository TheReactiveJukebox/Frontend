import {Component, Inject} from '@angular/core';
import { Track } from '../../models/track';
import { MdDialog, MdDialogRef} from '@angular/material';
import {FeedbackService} from '../../services/feedback.service';

@Component({
    selector: 'tendency-feedback-dialog',
    templateUrl: 'tendency-feedback-dialog.component.html',
})
export class TendencyFeedbackDialogComponent {
    cTrack: Track;

    constructor(public dialogRef: MdDialogRef<TendencyFeedbackDialogComponent>,
                public feedbackService: FeedbackService) {
    }

    btnLessDynamic() {
    }

    btnMoreDynamic() {
    }

    btnLessSpeed() {
    }

    btnMoreSpeed() {
    }

    //TODO: Rename methods (also in tendency-feedback-dialog.html)
    btnLikeMood() {
    }

    btnDislikeMood() {
    }

    btnLikeGenre() {
    }

    btnDislikeGenre() {
    }

    btnLikePeriod() {
    }

    btnDislikePeriod() {
    }


    confirmDialog() {
        // TODO this.feedbackService.sendCurrentTrackFeedback();
    }

    confirmAndApplyDialog() {
        // TODO this.feedbackService.sendCurrentTrackFeedback();
        //TODO Apply
    }

    closeDialog() {
        //TODO this.feedbackService.undoFeedback();
    }
}