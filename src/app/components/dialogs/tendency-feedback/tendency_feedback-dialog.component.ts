import {Component, Inject} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
    selector: 'tendency-feedback-dialog',
    templateUrl: 'tendency-feedback-dialog.component.html',
})
export class TendencyFeedbackDialogComponent {


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

    }

    confirmAndApplyDialog() {

    }

    closeDialog() {

    }
}