import {Component, Inject} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {Track} from '../../../models/track';

@Component({
    selector: 'tendency-feedback-dialog',
    templateUrl: 'tendency-feedback-dialog.component.html',
})
export class TendencyFeedbackDialogComponent {

    constructor(public dialogRef: MdDialogRef<TendencyFeedbackDialogComponent>) {
    }

    btnLessDynamics() {
    }

    btnMoreDynamics() {
    }

    btnSlower() {
    }

    btnFaster() {
    }

    btnMoreCheerful() {
    }

    btnSadder() {
    }

    btnOlder() {
    }

    btnNewer() {
    }

    confirmDialog() {

    }

    confirmAndApplyDialog() {

    }

    closeDialog() {

    }
}