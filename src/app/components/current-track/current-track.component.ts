import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Track} from '../../models/track';
import {FeedbackService} from '../../services/feedback.service';
import {HistoryService} from '../../services/history.service';
import {TrackService} from '../../services/track.service';

@Component({
    selector: 'current-track',
    templateUrl: './current-track.component.html',
    styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent implements OnInit, OnDestroy {

    public currentTrack: Track;
    public btnVisible: boolean = false;
    private subscriptions: Subscription[];
    public historyButtonClass: string = 'reducedHistory-button-toggle-off';

    constructor(public trackService: TrackService,
                public feedbackService: FeedbackService,
                public historyService: HistoryService) {

        this.subscriptions = [];
    }

    public ngOnInit(): void {

        // subscribe to the currentTrack BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions.push(
            this.trackService.currentTrack.subscribe((currentTrack: Track) => {
                this.currentTrack = currentTrack;
            })
        );

    }

    public ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    public btn_like(): void {
        this.feedbackService.postSimpleFeedback(this.currentTrack, true);

        this.btnVisible = true;
        //wait 3 seconds and hide
        setTimeout(function (): void {
            this.btnVisible = false;
        }.bind(this), 3000);
    }

    public btn_dislike(): void {
        this.feedbackService.postSimpleFeedback(this.currentTrack, false);

        this.btnVisible = true;
        //wait 3 seconds and hide
        setTimeout(function (): void {
            this.btnVisible = false;
        }.bind(this), 3000);
    }

    //opens a dialog for special feedback
    public dialog_special_feedback(): void {
        this.feedbackService.openTrackFeedbackDialog(this.currentTrack);
    }

    public btn_history_toggle(): void {
        if (this.historyService.historyVisible) {
            this.historyService.historyVisible = false;
            this.historyButtonClass = 'history-button-toggle-off';
        } else {
            this.historyService.historyVisible = true;
            this.historyButtonClass = 'history-button-toggle-on';
        }
    }

    public btn_renew(): void {
        this.trackService.refreshTrackList();
    }

}
