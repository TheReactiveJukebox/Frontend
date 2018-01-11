/**
 * This service takes care of the playback control.
 */
import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Track} from '../models/track';
import {HistoryService} from './history.service';
import {IndirectFeedbackService} from './indirect-feedback.service';
import {RadiostationService} from './radiostation.service';
import {TrackService} from './track.service';
import {SurveyService} from './survey.service';
import {LoggingService} from './logging.service';

@Injectable()
export class PlayerService implements OnDestroy {

    public currentTrack: Track;
    public audioPlayer: any = new Audio();
    private _volume: number = 0.5;
    public currentvol: number = 0.5;
    public progress: number = 0;
    public isPlaying: boolean = false;
    private subscriptions: Subscription[];

    constructor(private trackService: TrackService,
                private radiostationService: RadiostationService,
                private historyService: HistoryService,
                private surveyService: SurveyService,
                private indirectFeedbackService: IndirectFeedbackService,
                private loggingService: LoggingService) {
        //set the default player settings
        this.audioPlayer.type = 'audio/mpeg';
        this.audioPlayer.volume = this._volume;
        this.audioPlayer.ontimeupdate = () => {
            this.progressUpdate();
        };
        this.audioPlayer.onended = () => {
            this.songEnded();
        };
        // subscribe to the currentTrack BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions = [];
        this.subscriptions.push(
            this.trackService.currentTrack.subscribe(
                (currentTrack: Track) => {
                    this.currentTrack = currentTrack;
                    this.trackUpdated();
                }
            )
        );
        this.isPlaying = false;
    }

    public ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions
            ) {
            subscription.unsubscribe();
        }
    }

//exchange the songdata in the audio element to the current song
    private trackUpdated(): void {

        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.progressUpdate();

        if (this.currentTrack != null) {
            //music data for current track might not be loaded already (e.g. first song of new started radiostation)
            if (this.currentTrack.data) {
                //loading new track

                this.audioPlayer.src = this.currentTrack.data;

                this.audioPlayer.load();

                //was the player in playing state when the file file arrived?
                if (this.isPlaying) {
                    this.play();
                }
            } else {
                this.currentTrack.readyToPlay.subscribe(value => {
                    if (value == true) {
                        this.audioPlayer.src = this.currentTrack.data;
                        this.audioPlayer.load();

                        //was the player in playing state when the file file arrived?
                        if (this.isPlaying) {
                            this.play();
                        }
                    }
                });
            }
        } else {
            this.isPlaying = false;
        }
    }

//start playing
    public play(): void {
        if (this.currentTrack != null) {
            this.isPlaying = true;
            this.audioPlayer.play();
        } else {
            this.loggingService.log(this, 'There is no track to play!');
        }
    }

//pause playing
    public pause(): void {
        this.isPlaying = false;
        this.loggingService.log(this, 'Paused');
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
     * If more than 90% of the song are completed, the current
     * Track will be written to the global History beforehand.
     * @param addToHistory if true the current track will be written to history anyway.
     */
    public skipForward(addToHistory: boolean): void {
        if (this.currentTrack != null && (addToHistory || (this.progress / this.currentTrack.duration) > 0.9)) {
            this.historyService.writeToHistory(this.currentTrack);
            this.surveyService.countUp();
        }
        let currentID: number = this.currentTrack.id;
        let currentProgress: number = this.progress;

        let nextTrack: Track = this.trackService.nextSong();

        if (!addToHistory && nextTrack) { //Check if legitimate skip
            this.indirectFeedbackService.sendSkipFeedback(currentID, nextTrack.id,
                this.radiostationService.getRadiostation().id, currentProgress); //Skip feedback
        }
    }

//turns on the volume with the last set value
    public volumeOn(): void {
        this.setVolume(this._volume);
    }

//turns off the volume and remembers the last volume value (if the audio was already muted volume is set to 0.5)
    public volumeOff(): void {
        this._volume = this.audioPlayer.volume;
        if (this._volume == 0) {
            this._volume = 0.5;
        }
        this.setVolume(0);

    }

//set the volume if valid
    public setVolume(v: number): void {
        if (v < 0 || v > 1) {
            throw new Error('Invalid volume format');
        } else {
            this.audioPlayer.volume = v;
            this.currentvol = v;
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

    get volume(): number {
        return this.audioPlayer.volume;
    }
}
