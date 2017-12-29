import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Track} from '../../models/track';
import {FeedbackService} from '../../services/feedback.service';
import {PlayerService} from '../../services/player.service';
import {TrackService} from '../../services/track.service';

@Component({
    selector: 'player-control-bar',
    templateUrl: './player-control-bar.component.html',
    styleUrls: ['./player-control-bar.component.scss'],
})
export class PlayerControlBarComponent implements OnInit, OnDestroy {

    public currentTrack: Track;
    public title: string = '???';
    public artist: string = '???';
    public duration: number = 213;
    private subscriptions: Subscription[];

    constructor(public trackService: TrackService,
                public playerService: PlayerService,
                public feedbackService: FeedbackService) {
        this.subscriptions = [];
    }

    public ngOnInit(): void {
        // subscribe to the currentTrack BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions.push(
            this.trackService.currentTrack.subscribe((currentTrack: Track) => {
                if (currentTrack != null) {
                    this.currentTrack = currentTrack;
                    this.trackUpdated();
                }
            })
        );
    }

    public ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.playerService.stop();
    }

    private trackUpdated(): void {
        this.artist = this.currentTrack.artist.name;
        this.title = this.currentTrack.title;
        this.duration = this.currentTrack.duration;
    }

    public onProgressBarClick(event: MouseEvent): void {
        this.playerService.setProgress(event.offsetX / window.innerWidth * this.duration);
    }

    public onSliderChange(value: number): void {
        this.playerService.setVolume(value);
    }

    public feedback(): void {
        this.feedbackService.postTrackFeedback(this.currentTrack);
    }

}
