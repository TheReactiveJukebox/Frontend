import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrackService} from '../../services/track.service';
import {Track} from '../../models/track';
import {Subscription} from 'rxjs/Subscription';
import {FeedbackService} from '../../services/feedback.service';
import {RadiostationService} from '../../services/radiostation.service';
import {PlayerService} from '../../services/player.service';

@Component({
    selector: 'track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];
    nextTracks: Track[];

    constructor(public trackService: TrackService,
                public feedbackService: FeedbackService,
                public radiostationService: RadiostationService,
                public playerService: PlayerService) {
        this.subscriptions = [];
        this.nextTracks = [];
    }

    ngOnInit(): void {
        //this.trackService.refreshTracks();

        // subscribe to the nextTracks BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions.push(
            this.trackService.nextTracks.subscribe((nextTracks: Track[]) => {
                if (nextTracks != null) {
                    this.nextTracks = nextTracks;
                }
                if (this.nextTracks != null) {
                    console.log('NEXT TRACKS: ', this.nextTracks);
                }
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

    btn_Renew() {

    }

    jumpToTrack(track: Track): void{
        //if more than 90% of the song are completed, the current Track will be written to the global History
        if(this.playerService.currentTrack != null && (this.playerService.progress / this.playerService.currentTrack.duration) > 0.9){
            this.radiostationService.writeToHistory(this.playerService.currentTrack);
        }
        this.trackService.jumpToTrack(track)
    }
}
