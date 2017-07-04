import {Component, Output, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {TrackService} from '../../services/track.service';
import {Track} from '../../models/track';
import {Subscription} from 'rxjs/Subscription';
import {current} from 'codelyzer/util/syntaxKind';

@Component({
    selector: 'player-control-bar',
    templateUrl: './player-control-bar.component.html',
    styleUrls: ['./player-control-bar.component.scss'],
})
export class PlayerControlBarComponent implements OnInit, OnDestroy {


    public currentTrack: Track;
    public show: boolean = true;
    public audioPlayer: any = new Audio();
    public volume: number = 0.5;
    public progress: number = 0;
    private subscriptions: Subscription[];

    constructor(public trackService: TrackService) {
        this.subscriptions = [];
        this.audioPlayer.type = 'audio/mpeg';
        //TODO: replace with server url for current song
        this.audioPlayer.src = 'https://p.scdn.co/mp3-preview/fd3279ef9df976c127f1cf9ddaddaa6d067b77f6';
        this.audioPlayer.load();
        this.audioPlayer.ontimeupdate = () => {
            this.progressUpdate()
        };
        this.audioPlayer.onended = () => {
            this.songEnded()
        };
        this.audioPlayer.volume = this.volume;
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


    public skipForward(): void {
        this.trackService.nextSong();
        this.progress = 0;
        //var inPause = this.audioPlayer.paused;
        this.audioPlayer.pause();
        //this.audioPlayer.src = this.currentTrack.url;
        this.audioPlayer.load();
        //if(inPause) {
        //   this.audioPlayer.play();
        //}

    }

    public onProgressBarClick(event: MouseEvent): void {
        this.progress = event.offsetX / window.innerWidth * this.currentTrack.duration;
        this.audioPlayer.currentTime = event.offsetX / window.innerWidth * this.currentTrack.duration;
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

    public volumeOn(): void {
        this.audioPlayer.volume = 0.5;
    }

    public volumeOff(): void {
        this.audioPlayer.volume = 0;
    }

    public progressUpdate(): void {
        this.progress = this.audioPlayer.currentTime;
    }

    public songEnded(): void {
        this.skipForward()
    }
}