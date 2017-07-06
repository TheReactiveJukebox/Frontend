import {Component, Output, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {TrackService} from '../../services/track.service';
import {Track} from '../../models/track';
import {Subscription} from 'rxjs/Subscription';
import {current} from 'codelyzer/util/syntaxKind';
import {PlayerService} from '../../services/player.service';

@Component({
    selector: 'player-control-bar',
    templateUrl: './player-control-bar.component.html',
    styleUrls: ['./player-control-bar.component.scss'],
})
export class PlayerControlBarComponent implements OnInit, OnDestroy {


    public currentTrack: Track;
    public show: boolean = true;
    private subscriptions: Subscription[];

    constructor(public trackService: TrackService, public playerService: PlayerService) {
        this.subscriptions = [];

    }

    ngOnInit(): void {
        this.trackService.refreshTracks();

        // subscribe to the currentTrack BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions.push(
            this.trackService.currentTrack.subscribe((currentTrack: Track) => {
                this.currentTrack = currentTrack;
                this.trackUpdated()
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

    private trackUpdated(): void {
        if(!this.currentTrack == null) {
            this.show = true;
        }
    }

    public onProgressBarClick(event: MouseEvent): void {
        this.playerService.setProgress(event.offsetX / window.innerWidth * this.currentTrack.duration);
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