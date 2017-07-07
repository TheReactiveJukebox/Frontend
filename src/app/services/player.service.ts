import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {TrackService} from './track.service';
import {Track} from '../models/track';
import {RadiostationService} from './radiostation.service';
import {Headers, Request, RequestMethod, RequestOptions, RequestOptionsArgs} from '@angular/http';
import {AuthHttp} from './auth/auth-http';

@Injectable()
export class PlayerService implements OnDestroy {

    public currentTrack: Track;
    public audioPlayer: any = new Audio();
    private volume: number = 0.5;
    public progress: number = 0;
    public isPlaying: boolean = false;
    private subscriptions: Subscription[];

    constructor(private trackService: TrackService,
                private radiostationService: RadiostationService,
                private authHttp: AuthHttp) {

        //set the default player settings
        this.audioPlayer.type = 'audio/mpeg';
        this.audioPlayer.volume = this.volume;
        this.audioPlayer.ontimeupdate = () => {
            this.progressUpdate()
        };
        this.audioPlayer.onended = () => {
            this.songEnded()
        };
        // subscribe to the currentTrack BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions = [];
        this.subscriptions.push(
            this.trackService.currentTrack.subscribe(
                (currentTrack: Track) => {
                    this.currentTrack = currentTrack;

                    this.currentTrack = new Track();
                    this.currentTrack.file = 'https://192.168.99.100/music/f/5/4019b526351166dc5654e963a9aabe552f0d27b69b373fbbb62b084eefd30d.mp3';

                    this.trackUpdated();
                }
            )
        )
        ;
        this.trackService.refreshTracks();
        this.isPlaying = false;
    }

    ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions
            ) {
            subscription.unsubscribe();
        }
    }

//exchange the track in the audio element
    private trackUpdated(): void {
        let wasPlaying = this.isPlaying;

        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.progressUpdate();
        if (this.currentTrack != null) {

            //TODO: Access the right file
            //this.audioPlayer.src = 'https://p.scdn.co/mp3-preview/fd3279ef9df976c127f1cf9ddaddaa6d067b77f6.mp3';

            //this.audioPlayer.src = this.getMusicFile(this.currentTrack.file);

            this.audioPlayer.load();

        }
        if (wasPlaying) {
            this.audioPlayer.play();
            console.log('Now playing: ' + this.currentTrack.title);
        }
    }

//start playing
    public play(): void {
        this.isPlaying = true;
        console.log('Now playing: ' + this.currentTrack.title);

        this.audioPlayer.src = 'https://192.168.99.100/music/f/5/4019b526351166dc5654e963a9aabe552f0d27b69b373fbbb62b084eefd30d.mp3';
        this.audioPlayer.load();

        this.audioPlayer.play();
    }

//pause playing
    public pause(): void {
        this.isPlaying = false;
        console.log('Paused');
        this.audioPlayer.pause();
    }

//stop playing by pausing and setting the progress back to start
    public stop(): void {
        this.pause();
        this.audioPlayer.currentTime = 0;
        this.progressUpdate();
    }

    /*
     * Skips to the next Track. If Player was playing before, playback will continue.
     * If count flag ist set or more than 90% of the song are completed, the current
     * Track will be written to the global History beforehand.
     */
    public skipForward(addToHistory: boolean): void {
        if (addToHistory || (this.progress / this.currentTrack.duration) > 0.9
        ) {
            this.radiostationService.writeToHistory(this.currentTrack);
        }
        this.trackService.nextSong();
    }

//turns on the volume with the last set value
    public volumeOn(): void {
        this.setVolume(this.volume);
    }

//turns off the volume and remembers the last volume value (if the audio was already muted volume is set to 0.5)
    public volumeOff(): void {
        this.volume = this.audioPlayer.volume;
        if (this.volume == 0) {
            this.volume = 0.5;
        }
        this.setVolume(0);

    }

//set the volume if valid
    public setVolume(v: number): void {
        if (v < 0 || v > 1
        ) {
            throw new Error('Invalid volume format');
        }
        else {
            this.audioPlayer.volume = v;
        }
    }

//sets the audio element to a specific second
    public setProgress(newTime: number): void {
        if (newTime <= this.currentTrack.duration
        ) {
            this.audioPlayer.currentTime = newTime;
        }
    }

//keeps the progress field to the latest value
    public progressUpdate(): void {
        this.progress = this.audioPlayer.currentTime;
    }

//starts the new song and writes the old one to history
    public songEnded(): void {
        this.skipForward(true);
    }

    public test2(): void {
        this.authHttp.getTrack('https://192.168.99.100/music/f/5/4019b526351166dc5654e963a9aabe552f0d27b69b373fbbb62b084eefd30d.mp3').subscribe(data => {
            this.audioPlayer.src = data;
            this.audioPlayer.play();
        }, err => {
            console.log('GET TRACK ERROR: ', err);
        });
    }


    private getMusicFile(url: string) {

        let basicOptions: RequestOptionsArgs = {
            url: url,
            method: RequestMethod.Get,
            headers: new Headers(),
            search: null,
            body: null
        };
        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        this.authHttp.request(req, reqOptions).subscribe((data: any) => {
            console.log('This is the File request');
            console.log(data._body);
        });

        return url;

    }
}
