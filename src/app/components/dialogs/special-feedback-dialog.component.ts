import {Component, Inject} from '@angular/core';
import { Track } from '../../models/track';
import { MdDialog, MdDialogRef} from '@angular/material';

@Component({
    selector: 'special-feedback-dialog',
    templateUrl: 'special-feedback-dialog.component.html',
})
export class SpecialFeedbackDialogComponent {
    cTrack: Track;

    constructor(public dialogRef: MdDialogRef<SpecialFeedbackDialogComponent>) {
    }

    btnLike(event){

    }

    btnDislike(event){

    }

    confirmDialog(event){
        //TODO
    }

    confirmAndApplyDialog(event){
        //TODO
    }
}
