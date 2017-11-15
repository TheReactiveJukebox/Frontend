import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Track} from '../../models/track';
import {HistoryService} from '../../services/history.service';
import {IndirectFeedbackService} from '../../services/indirect-feedback.service';
import {PlayerService} from '../../services/player.service';
import {RadiostationService} from '../../services/radiostation.service';
import {TrackService} from '../../services/track.service';

@Component({
    selector: 'track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];
    nextTracks: Track[];

    constructor(public trackService: TrackService,
                public indirectFeedbackService: IndirectFeedbackService,
                public radiostationService: RadiostationService,
                private historyService: HistoryService,
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

    jumpToTrack(track: Track): void {
        //if more than 90% of the song are completed, the current Track will be written to the global History
        if (this.playerService.currentTrack != null && (this.playerService.progress / this.playerService.currentTrack.duration) > 0.9) {
            this.historyService.writeToHistory(this.playerService.currentTrack);
        }
        this.indirectFeedbackService.sendMultiSkipFeedback(this.playerService.currentTrack.id, track.id ,
            this.radiostationService.getRadiostation().id, this.playerService.progress);
        this.trackService.jumpToTrack(track);
    }

    indirectFeedback(track: Track): void {
        //Sends delete feedback with position as zero to indicate deletion from upcoming songs
        this.indirectFeedbackService.sendDeleteFeedback(track.id, this.radiostationService.getRadiostation().id, 0);
    }
}
