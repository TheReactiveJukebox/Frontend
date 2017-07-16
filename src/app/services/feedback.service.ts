/**
 * This service takes care of feedback
 */
import {Injectable, OnDestroy} from '@angular/core';
import {TrackService} from './track.service';
import {SpecialFeedbackDialogComponent} from '../components/dialogs/special-feedback-dialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';
import {Config} from '../config';
import {Subscription} from 'rxjs/Subscription';
import {TrackFeedback} from '../models/trackFeedback';
import {RadiostationService} from './radiostation.service';
import {AuthHttp} from './auth/auth-http';
import {Track} from '../models/track';

@Injectable()
export class FeedbackService implements OnDestroy {

    dialogRef: MdDialogRef<any>;


    private feedbackUrl = Config.serverUrl + '/api/track/feedback?id=';  // URL to web api
    public currentTrack: Track;
    private currentTrackFeedback;
    private subscriptions: Subscription[];

    constructor(private trackService: TrackService,
                private radiostationService: RadiostationService,
                private authHttp: AuthHttp,
                public dialog: MdDialog) {
        this.currentTrackFeedback = new TrackFeedback();
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
        )
    }

    ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions
            ) {
            subscription.unsubscribe();
        }
    }

    public like(): void {
        console.log('CALL: Like');
        this.currentTrackFeedback.songLiked = true;
        if (this.currentTrackFeedback.songDisliked) {
            //We don't know if the user dislikes the song
            this.currentTrackFeedback.songDisliked = null;
        }
    }

    public dislike(): void {
        console.log('CALL: Dislike');
        this.currentTrackFeedback.songDisliked = true;
        if (this.currentTrackFeedback.songLiked) {
            //We don't know if the user likes the song
            this.currentTrackFeedback.songLiked = null;
        }
    }

    private createTrackFeedbackToCurrentTrack(): TrackFeedback {
        let feedback = new TrackFeedback();
        if (this.currentTrack != null) {
            feedback.trackId = this.currentTrack.id;
            feedback.radioId = this.radiostationService.jukebox.id;
        }
        return feedback;
    }

    public getSpecialFeedback(): void {
        //TODO show dialog and send result to server
        this.dialogRef = this.dialog.open(SpecialFeedbackDialogComponent);
        this.dialogRef.componentInstance.cTrack = this.trackService.currentTrack;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
        let tmpFeedback = this.currentTrackFeedback;

    }

    public getTendencyFeedback(): void {
        console.log('CALL tendency Feedback');
        //TODO: open tendency dialog and process information
    }

    public dislikeCurrentSong(): void {
        this.currentTrackFeedback.songDisliked = true;
        if (this.currentTrackFeedback.songLiked) {
            //We don't know if the user likes the song
            this.currentTrackFeedback.songLiked = null;
        }
    }

    public likeCurrentSong(): void {
        this.currentTrackFeedback.songLiked = true;
        if (this.currentTrackFeedback.songDisliked) {
            //We don't know if the user dislikes the song
            this.currentTrackFeedback.songDisliked = null;
        }
    }

    public dislikeCurrentArtist(): void {
        this.currentTrackFeedback.artistDisliked = true;
        if (this.currentTrackFeedback.artistLiked) {
            //We don't know if the user likes the artist
            this.currentTrackFeedback.artistLiked = null;
        }
    }

    public likeCurrentArtist(): void {
        this.currentTrackFeedback.artistLiked = true;
        if (this.currentTrackFeedback.artistDisliked) {
            //We don't know if the user dislikes the artist
            this.currentTrackFeedback.artistDisliked = null;
        }
    }

    public dislikeCurrentSpeed(): void {
        this.currentTrackFeedback.speedDisliked = true;
        if (this.currentTrackFeedback.speedLiked) {
            //We don't know if the user likes the speed
            this.currentTrackFeedback.speedLiked = null;
        }
    }

    public likeCurrentSpeed(): void {
        this.currentTrackFeedback.speedLiked = true;
        if (this.currentTrackFeedback.speedDisliked) {
            //We don't know if the user dislikes the speed
            this.currentTrackFeedback.speedDisliked = null;
        }
    }

    public dislikeCurrentGenre(): void {
        this.currentTrackFeedback.genreDisliked = true;
        if (this.currentTrackFeedback.genreLiked) {
            //We don't know if the user likes the genre
            this.currentTrackFeedback.genreLiked = null;
        }
    }

    public likeCurrentGenre(): void {
        this.currentTrackFeedback.genreLiked = true;
        if (this.currentTrackFeedback.genreDisliked) {
            //We don't know if the user dislikes the genre
            this.currentTrackFeedback.genreDisliked = null;
        }
    }

    public dislikeCurrentDynamics(): void {
        this.currentTrackFeedback.dynamicsDisliked = true;
        if (this.currentTrackFeedback.dynamicsLiked) {
            //We don't know if the user likes the dynamics
            this.currentTrackFeedback.dynamicsLiked = null;
        }
    }

    public likeCurrentDynamics(): void {
        this.currentTrackFeedback.dynamicsLiked = true;
        if (this.currentTrackFeedback.dynamicsDisliked) {
            //We don't know if the user dislikes the dynamics
            this.currentTrackFeedback.dynamicsDisliked = null;
        }
    }

    public dislikeCurrentPeriod(): void {
        this.currentTrackFeedback.periodDisliked = true;
        if (this.currentTrackFeedback.periodLiked) {
            //We don't know if the user likes the period
            this.currentTrackFeedback.periodLiked = null;
        }
    }

    public likeCurrentPeriod(): void {
        this.currentTrackFeedback.periodLiked = true;
        if (this.currentTrackFeedback.periodDisliked) {
            //We don't know if the user dislikes the period
            this.currentTrackFeedback.periodDisliked = null;
        }
    }

    public dislikeCurrentMood(): void {
        this.currentTrackFeedback.moodDisliked = true;
        if (this.currentTrackFeedback.moodLiked) {
            //We don't know if the user likes the mood
            this.currentTrackFeedback.moodLiked = null;
        }
    }

    public likeCurrentMood(): void {
        this.currentTrackFeedback.moodLiked = true;
        if (this.currentTrackFeedback.moodDisliked) {
            //We don't know if the user dislikes the mood
            this.currentTrackFeedback.moodDisliked = null;
        }
    }

    public sendCurrentTrackFeedback(): void {
        if (this.isCurrentTrackFeedbackValid()) {
            console.log('Sending feedback for current track');
            this.authHttp.post(this.feedbackUrl + this.currentTrackFeedback.trackId, this.currentTrackFeedback).subscribe((data: any) => {
                console.log('FEEDBACK RETURN DATA: ', data);
            }, (error: Response) => {
                if (error.status == 400) {
                    console.log('The provided feedback entry is malformed');
                }
                console.log('Sending feedback failed: ', error);
            });

        } else {
            console.warn('Trying to send invalid feedback!')
        }
        this.currentTrackFeedback = new TrackFeedback;

    }

    private trackUpdated(): void {
        if (this.currentTrackFeedback != null) {
            this.sendCurrentTrackFeedback();
        }
        this.currentTrackFeedback = this.createTrackFeedbackToCurrentTrack();

    }


    private isCurrentTrackFeedbackValid(): boolean {
        let a = this.currentTrackFeedback.radioId != null;
        let b = this.currentTrackFeedback.trackId != null;
        let c = this.currentTrackFeedback.songLiked;
        let d = this.currentTrackFeedback.songDisliked;
        let e = this.currentTrackFeedback.artistLiked;
        let f = this.currentTrackFeedback.artistDisliked;
        let g = this.currentTrackFeedback.speedLiked;
        let h = this.currentTrackFeedback.speedDisliked;
        let i = this.currentTrackFeedback.genreLiked;
        let j = this.currentTrackFeedback.genreDisliked;
        let k = this.currentTrackFeedback.dynamicsLiked;
        let l = this.currentTrackFeedback.dynamicsDisliked;
        let m = this.currentTrackFeedback.periodLiked;
        let n = this.currentTrackFeedback.periodDisliked;
        let o = this.currentTrackFeedback.moodLiked;
        let p = this.currentTrackFeedback.moodDisliked;
        return (a && b && (c || d || e || f || g || h || i || j || k || l || m || n || o || p));
    }
}
