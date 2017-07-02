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
}