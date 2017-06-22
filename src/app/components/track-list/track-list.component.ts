import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { Track } from '../../models/track';
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdDialogRef} from '@angular/material';
import {TendencyFeedbackDialogComponent} from '../dialogs/tendency_feedback-dialog.component';

@Component({
    selector: 'track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit, OnDestroy{

    private subscriptions: Subscription[];
    nextTracks: Track[];
    dialogRef: MdDialogRef<any>;

    constructor(public trackService: TrackService, public dialog: MdDialog) {
        this.subscriptions = [];
        this.nextTracks = [];
    }

    ngOnInit(): void {
        this.trackService.refreshTracks();

        // subscribe to the nextTracks BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions.push(
            this.trackService.nextTracks.subscribe((nextTracks: Track[]) => {
                this.nextTracks = nextTracks;
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

    btn_Tendency(event){
        this.dialogRef = this.dialog.open(TendencyFeedbackDialogComponent);
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
    }

    btn_Renew(event){

    }
}
