import {Component} from '@angular/core';
import {Track} from '../../models/track';
import {MdDialogRef} from '@angular/material';

@Component({
    selector: 'special-feedback-dialog',
    templateUrl: 'special-feedback-dialog.component.html',
})
export class SpecialFeedbackDialogComponent {
    cTrack: Track;

    constructor(public dialogRef: MdDialogRef<SpecialFeedbackDialogComponent>) {
    }

    btnLike() {

    }

    btnDislike() {

    }

    confirmDialog() {
        //TODO
    }

    confirmAndApplyDialog() {
        //TODO
    }
}
