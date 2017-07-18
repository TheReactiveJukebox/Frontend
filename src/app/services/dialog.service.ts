/**
 * Created by Ben Wilkes on 18.07.2017.
 */

import {Injectable, OnDestroy} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {Track} from '../models/track';
import {SpecialFeedbackDialogComponent} from '../components/dialogs/special-feedback-dialog.component';
import {TendencyFeedbackDialogComponent} from '../components/dialogs/tendency_feedback-dialog.component';
import {FeedbackService} from './feedback.service';


/**
 * This service handles showing dialogs.
 */
@Injectable()
export class DialogService {

    dialogRef: MdDialogRef<any>;


    constructor(public dialog: MdDialog, public feedbackService: FeedbackService) {
    }


    public openTrackFeedbackDialog(track: Track): void {
        console.log('opening dialog');
        this.dialogRef = this.dialog.open(SpecialFeedbackDialogComponent);
        this.dialogRef.componentInstance.cTrack = track;
        this.dialogRef.componentInstance.cFeedback = this.feedbackService.createTrackFeedbackToTrack(track);
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
    }

    public openTendencyFeedbackDialog(): void {
        console.log('CALL tendency Feedback');
        this.dialogRef = this.dialog.open(TendencyFeedbackDialogComponent);
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
    }

}
