/**
 * This service takes care of the playback control.
 */
import {Injectable} from '@angular/core';
import {TrackService} from './track.service';
import {SpecialFeedbackDialogComponent} from '../components/dialogs/special-feedback-dialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';

@Injectable()
export class FeedbackService {

    dialogRef: MdDialogRef<any>;

    constructor(private trackService: TrackService, public dialog: MdDialog) {

    }

    public like(): void {
        //TODO: push like to server with current song information
    }

    public dislike(): void {
        //TODO: push dislike to server with current song information
    }

    public getSpecialFeedback(): void {
        //TODO show dialog and send result to server
        this.dialogRef = this.dialog.open(SpecialFeedbackDialogComponent);
        this.dialogRef.componentInstance.cTrack = this.trackService.currentTrack;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
    }

    public getTendencyFeedback(): void {
        //TODO: open tendency dialog and process information
    }
}
