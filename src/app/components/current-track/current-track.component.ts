import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrackService} from '../../services/track.service';
import {Track} from '../../models/track';
import {Subscription} from 'rxjs/Subscription';
import {MdDialog, MdDialogRef} from '@angular/material';
import {SpecialFeedbackDialogComponent} from '../dialogs/special-feedback-dialog.component';

@Component({
    selector: 'current-track',
    templateUrl: './current-track.component.html',
    styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent implements OnInit, OnDestroy {

    currentTrack: Track;
    btnVisible: boolean = false;
    dialogRef: MdDialogRef<any>;
    private subscriptions: Subscription[];

    constructor(public trackService: TrackService, public dialog: MdDialog) {
        this.subscriptions = [];
    }

    ngOnInit(): void {

        // subscribe to the currentTrack BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions.push(
            this.trackService.currentTrack.subscribe((currentTrack: Track) => {
                this.currentTrack = currentTrack;
            })
        );

    }

    ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    btn_like(event) {
        this.btnVisible = true;
        //wait 3 seconds and hide
        setTimeout(function () {
            this.btnVisible = false;
        }.bind(this), 3000);
    }

    btn_dislike(event) {
        this.btnVisible = true;
        //wait 3 seconds and hide
        setTimeout(function () {
            this.btnVisible = false;
        }.bind(this), 3000);
    }

    //opens a dialog to speciy the feedback
    dialog_special_feedback(event) {
        this.dialogRef = this.dialog.open(SpecialFeedbackDialogComponent);
        this.dialogRef.componentInstance.cTrack = this.currentTrack;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
    }

}





