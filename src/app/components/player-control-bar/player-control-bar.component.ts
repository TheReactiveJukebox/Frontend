import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrackService} from '../../services/track.service';
import {Track} from '../../models/track';
import {Subscription} from 'rxjs/Subscription';
import {PlayerService} from '../../services/player.service';
import {MdSliderChange} from '@angular/material';

@Component({
    selector: 'player-control-bar',
    templateUrl: './player-control-bar.component.html',
    styleUrls: ['./player-control-bar.component.scss'],
})
export class PlayerControlBarComponent implements OnInit, OnDestroy {


    public currentTrack: Track;
    public show: boolean = true;
    public title: string = '???';
    public artist: string = '???';
    public duration: number = 213;
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
            this.artist = this.currentTrack.artist.name;
            this.title = this.currentTrack.title;
            this.duration = this.currentTrack.duration;
        } else {
            //this.show = false;
            this.artist = '???';
            this.title = '???';
            this.duration = 213;
        }
    }

    public onProgressBarClick(event: MouseEvent): void {
        this.playerService.setProgress(event.offsetX / window.innerWidth * this.duration);
    }

    public onSliderChange(event: MdSliderChange): void {
        this.playerService.setVolume(event.value);
    }

    public like(): void {
        //TODO: call like service
    }

    public dislike(): void {
        //TODO: call dislike service
    }

    public detailFeedback(): void {
        //TODO: call service for detailed feedback
    }

}