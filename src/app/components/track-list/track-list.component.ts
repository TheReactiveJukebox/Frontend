import {Component, OnDestroy, OnInit, ViewChildren, QueryList} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Track} from '../../models/track';
import {HistoryService} from '../../services/history.service';
import {IndirectFeedbackService} from '../../services/indirect-feedback.service';
import {PlayerService} from '../../services/player.service';
import {RadiostationService} from '../../services/radiostation.service';
import {TrackService} from '../../services/track.service';
import {TrackListItemComponent} from './track-list-item/track-list-item.component';


@Component({
    selector: 'track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit, OnDestroy {

    @ViewChildren('hist') private historyChildcomponents: QueryList<TrackListItemComponent>;
    @ViewChildren('curr') private currChildcomponents: QueryList<TrackListItemComponent>;
    @ViewChildren('upcoming') private upcomingChildcomponents: QueryList<TrackListItemComponent>;

    private subscriptions: Subscription[];
    public nextTracks: Track[];
    public currentTrack: Track;
    private detailedTrack: Track;

    constructor(public trackService: TrackService,
                public indirectFeedbackService: IndirectFeedbackService,
                public radiostationService: RadiostationService,
                private historyService: HistoryService,
                public playerService: PlayerService) {
        this.subscriptions = [];
        this.nextTracks = [];

    }

    public ngOnInit(): void {
        //this.trackService.refreshCurrentAndUpcomingTracks();

        // subscribe to the nextTracks BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions.push(
            this.trackService.currentTrack.subscribe((currentTrack: Track) => {
                if (currentTrack != null) {
                    this.currentTrack = currentTrack;
                    this.detailedTrack = this.currentTrack;
                }
            })
        );
        this.subscriptions.push(
            this.trackService.nextTracks.subscribe((nextTracks: Track[]) => {
                if (nextTracks != null) {
                    this.nextTracks = nextTracks;
                }
            }));
    }

    public ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    public jumpToTrack(track: Track): void {
        //if more than 90% of the song are completed, the current Track will be written to the global History
        if (this.playerService.currentTrack != null && (this.playerService.progress / this.playerService.currentTrack.duration) > 0.9) {
            this.historyService.writeToHistory(this.playerService.currentTrack);
        }
        this.indirectFeedbackService.sendMultiSkipFeedback(this.playerService.currentTrack.id, track.id,
            this.radiostationService.getRadiostation().id, this.playerService.progress);
        this.trackService.jumpToTrack(track);
    }

    public indirectFeedback(track: Track): void {
        //Sends delete feedback with position as zero to indicate deletion from upcoming songs
        this.indirectFeedbackService.sendDeleteFeedback(track.id, this.radiostationService.getRadiostation().id, 0);
    }

    public setCurrentTrackDetailed(): void {
        this.historyChildcomponents.forEach(trackComp => trackComp.setDetailedView(false));
        this.upcomingChildcomponents.forEach(trackComp => trackComp.setDetailedView(false));
        this.currChildcomponents.forEach(trackComp => trackComp.setDetailedView(true));
    }

    public setDetailedTrack(track: Track): void {
        this.historyChildcomponents.forEach(trackComp => trackComp.setDetailedView(false));
        this.currChildcomponents.forEach(trackComp => trackComp.setDetailedView(false));
        this.upcomingChildcomponents.forEach(trackComp => trackComp.setDetailedView(false));
        this.detailedTrack = track;
    }
}
