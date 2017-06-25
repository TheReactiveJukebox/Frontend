import { Component, Output, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import {TrackService} from '../../services/track.service';
import {Track} from '../../models/track';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'player-control-bar',
    templateUrl: './player-control-bar.component.html',
    styleUrls: ['./player-control-bar.component.css'],
})
export class PlayerControlBarComponent implements OnInit, OnDestroy {


    // Controls
    @Output() detailedFeedback = new EventEmitter();

    public currentTrack: Track;
    public show: boolean;
    public audioPlayer: any;
    private subscriptions: Subscription[];

    constructor(public trackService: TrackService) {
        this.subscriptions = [];
        this.audioPlayer = new Audio();
    }

    ngOnInit(): void {
        this.trackService.refreshTracks();

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

    public skipBackward(): void {
        //TODO: set the last track as current track as soon there is a real list at the server
    }

    public skipForward(): void {
        this.trackService.nextSong()
    }

    public like(): void {
        //TODO: call like procedure
    }

    public dislike(): void {
        //TODO: call dislike procedure
    }

    public detailFeedback(): void {
        //TODO: call procedure for detailed feedback
    }
}