import {Component, Inject} from '@angular/core';
import { Track } from '../../models/track';
import { MdDialog, MdDialogRef} from '@angular/material';

@Component({
    selector: 'tendency-feedback-dialog',
    templateUrl: 'tendency-feedback-dialog.component.html',
})
export class TendencyFeedbackDialogComponent {
    cTrack: Track;

    constructor(public dialogRef: MdDialogRef<TendencyFeedbackDialogComponent>) {
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