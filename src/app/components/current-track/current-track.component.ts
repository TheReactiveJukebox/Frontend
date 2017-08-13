import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Track} from '../../models/track';
import {DialogService} from '../../services/dialog.service';
import {FeedbackService} from '../../services/feedback.service';
import {HistoryService} from '../../services/history.service';
import {TrackService} from '../../services/track.service';


@Component({
    selector: 'current-track',
    templateUrl: './current-track.component.html',
    styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent implements OnInit, OnDestroy {

    currentTrack: Track;
    currentYear: number;
    btnVisible: boolean = false;
    private subscriptions: Subscription[];
    historyButtonClass: string = 'reducedHistory-button-toggle-off';


    constructor(public trackService: TrackService,
                public feedbackService: FeedbackService,
                public historyService: HistoryService) {

        this.subscriptions = [];
    }

    ngOnInit(): void {

        // subscribe to the currentTrack BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions.push(
            this.trackService.currentTrack.subscribe((currentTrack: Track) => {
                    this.currentTrack = currentTrack;

                    //save release year of track to show it in the track description
                    this.currentYear = null;
                    if (this.currentTrack != null) {
                        if (this.currentTrack.releaseDate != null) {
                            let currentReleaseDate: Date = new Date(this.currentTrack.releaseDate);
                            this.currentYear = currentReleaseDate.getFullYear();
                        }
                    }
                }
            )
        );
    }

    ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions
            ) {
            subscription.unsubscribe();
        }
    }

    btn_like(): void {
        this.feedbackService.postSimpleFeedback(this.currentTrack, true);

        this.btnVisible = true;
//wait 3 seconds and hide
        setTimeout(function () {
            this.btnVisible = false;
        }.bind(this), 3000);
    }

    btn_dislike(): void {
        this.feedbackService.postSimpleFeedback(this.currentTrack, false);

        this.btnVisible = true;
//wait 3 seconds and hide
        setTimeout(function () {
            this.btnVisible = false;
        }.bind(this), 3000);
    }

//opens a dialog for special feedback
    dialog_special_feedback(): void {
        this.feedbackService.openTrackFeedbackDialog(this.currentTrack);
    }

    btn_Tendency(): void {
        this.feedbackService.openTendencyFeedbackDialog();
    }

    btn_history_toggle(): void {
        if (this.historyService.historyVisible
        ) {
            this.historyService.historyVisible = false;
            this.historyButtonClass = 'history-button-toggle-off';
        }
        else {
            this.historyService.historyVisible = true;
            this.historyButtonClass = 'history-button-toggle-on';
        }
    }

    btn_renew(): void {
        this.trackService.refreshTrackList();
    }

}
