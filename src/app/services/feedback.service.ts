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
import {TendencyFeedbackDialogComponent} from '../components/dialogs/tendency_feedback-dialog.component';

@Injectable()
export class FeedbackService {

    dialogRef: MdDialogRef<any>;


    private feedbackUrl = Config.serverUrl + '/api/track/feedback?id=';  // URL to web api

    constructor(private trackService: TrackService,
                private radiostationService: RadiostationService,
                private authHttp: AuthHttp,
                public dialog: MdDialog) {
    }


    public createTrackFeedbackToTrack(track: Track): TrackFeedback {
        let feedback = new TrackFeedback();
        if (track != null) {
            feedback.trackId = track.id;
        }
        feedback.radioId = this.radiostationService.jukebox.id;
        return feedback;
    }

    public getSpecialFeedback(track: Track): void {
        console.log('opening dialog');
        this.dialogRef = this.dialog.open(SpecialFeedbackDialogComponent);
        this.dialogRef.componentInstance.cTrack = track;
        this.dialogRef.componentInstance.cFeedback = this.createTrackFeedbackToTrack(track);
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
    }

    public getTendencyFeedback(): void {
        console.log('CALL tendency Feedback');
        this.dialogRef = this.dialog.open(TendencyFeedbackDialogComponent);
        this.dialogRef.componentInstance.cTrack = this.currentTrack;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
        //TODO: open tendency dialog and process information
    }

    public dislikeSong(feedback: TrackFeedback): TrackFeedback {
        feedback.songDisliked = true;
        if (feedback.songLiked) {
            //We don't know if the user likes the song
            feedback.songLiked = null;
        } return feedback;
    }

    public likeSong(feedback: TrackFeedback): TrackFeedback {
        feedback.songLiked = true;
        if (feedback.songDisliked) {
            //We don't know if the user dislikes the song
            feedback.songDisliked = null;
        } return feedback;
    }

    public dislikeArtist(feedback: TrackFeedback): TrackFeedback {
        feedback.artistDisliked = true;
        if (feedback.artistLiked) {
            //We don't know if the user likes the artist
            feedback.artistLiked = null;
        } return feedback;
    }

    public likeArtist(feedback: TrackFeedback): TrackFeedback {
        feedback.artistLiked = true;
        if (feedback.artistDisliked) {
            //We don't know if the user dislikes the artist
            feedback.artistDisliked = null;
        } return feedback;
    }

    public dislikeSpeed(feedback: TrackFeedback): TrackFeedback {
        feedback.speedDisliked = true;
        if (feedback.speedLiked) {
            //We don't know if the user likes the speed
            feedback.speedLiked = null;
        } return feedback;
    }

    public likeSpeed(feedback: TrackFeedback): TrackFeedback {
        feedback.speedLiked = true;
        if (feedback.speedDisliked) {
            //We don't know if the user dislikes the speed
            feedback.speedDisliked = null;
        } return feedback;
    }

    public dislikeGenre(feedback: TrackFeedback): TrackFeedback {
        feedback.genreDisliked = true;
        if (feedback.genreLiked) {
            //We don't know if the user likes the genre
            feedback.genreLiked = null;
        } return feedback;
    }

    public likeGenre(feedback: TrackFeedback): TrackFeedback {
        feedback.genreLiked = true;
        if (feedback.genreDisliked) {
            //We don't know if the user dislikes the genre
            feedback.genreDisliked = null;
        } return feedback;
    }

    public dislikeDynamics(feedback: TrackFeedback): TrackFeedback {
        feedback.dynamicsDisliked = true;
        if (feedback.dynamicsLiked) {
            //We don't know if the user likes the dynamics
            feedback.dynamicsLiked = null;
        } return feedback;
    }

    public likeDynamics(feedback: TrackFeedback): TrackFeedback {
        feedback.dynamicsLiked = true;
        if (feedback.dynamicsDisliked) {
            //We don't know if the user dislikes the dynamics
            feedback.dynamicsDisliked = null;
        } return feedback;
    }

    public dislikePeriod(feedback: TrackFeedback): TrackFeedback {
        feedback.periodDisliked = true;
        if (feedback.periodLiked) {
            //We don't know if the user likes the period
            feedback.periodLiked = null;
        } return feedback;
    }

    public likePeriod(feedback: TrackFeedback): TrackFeedback {
        feedback.periodLiked = true;
        if (feedback.periodDisliked) {
            //We don't know if the user dislikes the period
            feedback.periodDisliked = null;
        } return feedback;
    }

    public dislikeMood(feedback: TrackFeedback): TrackFeedback {
        feedback.moodDisliked = true;
        if (feedback.moodLiked) {
            //We don't know if the user likes the mood
            feedback.moodLiked = null;
        } return feedback;
    }

    public likeMood(feedback: TrackFeedback): TrackFeedback {
        feedback.moodLiked = true;
        if (feedback.moodDisliked) {
            //We don't know if the user dislikes the mood
            feedback.moodDisliked = null;
        } return feedback;
    }

    public postTrackFeedback(feedback: TrackFeedback): void{
        if (this.isTrackFeedbackValid(feedback)) {
            console.log('Sending feedback for TrackID: '+feedback.trackId);
            this.authHttp.post(this.feedbackUrl + feedback.trackId, feedback).subscribe((data: any) => {
                console.log(data);
            }, (error: Response) => {
                if (error.status == 400) {
                    console.log('The provided feedback entry is malformed');
                }
                console.log('Sending feedback failed: ', error);
            });

        }
    }

    private isTrackFeedbackValid(feedback:TrackFeedback): boolean {
        let a = feedback.radioId != null;
        let b = feedback.trackId != null;
        let c = feedback.songLiked;
        let d = feedback.songDisliked;
        let e = feedback.artistLiked;
        let f = feedback.artistDisliked;
        let g = feedback.speedLiked;
        let h = feedback.speedDisliked;
        let i = feedback.genreLiked;
        let j = feedback.genreDisliked;
        let k = feedback.dynamicsLiked;
        let l = feedback.dynamicsDisliked;
        let m = feedback.periodLiked;
        let n = feedback.periodDisliked;
        let o = feedback.moodLiked;
        let p = feedback.moodDisliked;
        return (a && b && (c || d || e || f || g || h || i || j || k || l || m || n || o || p));
    }
}
