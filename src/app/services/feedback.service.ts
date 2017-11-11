/**
 * This service takes care of feedback
 */
import {Injectable} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {SpecialFeedbackDialogComponent} from '../components/dialogs/special-feedback/special-feedback-dialog.component';
import {Config} from '../config';
import {Track} from '../models/track';
import {TrackFeedback} from '../models/track-feedback';
import {AuthHttp} from './auth/auth-http';
import {RadiostationService} from './radiostation.service';

@Injectable()
export class FeedbackService {

    private feedbackUrl = Config.serverUrl + '/api/track/feedback';  // URL to web api

    private dialogRef: MdDialogRef<any>;

    constructor(public radiostationService: RadiostationService,
                public dialog: MdDialog,
                private authHttp: AuthHttp) {}

    /**
     * Creates a TrackFeedback object which is matching to the given track and the current radio
     * @param track
     * @returns {TrackFeedback}
     */
    public createTrackFeedbackToTrack(track: Track): TrackFeedback {
        let feedback = new TrackFeedback();
        if (track != null) {
            feedback.trackId = track.id;
        }
        feedback.radioId = this.radiostationService.getJukebox().id;
        return feedback;
    }

    public dislikeSong(feedback: TrackFeedback): TrackFeedback {
        feedback.songDisliked = true;
        if (feedback.songLiked) {
            //We don't know if the user likes the song
            feedback.songLiked = null;
        }
        return feedback;
    }

    public likeSong(feedback: TrackFeedback): TrackFeedback {
        feedback.songLiked = true;
        if (feedback.songDisliked) {
            //We don't know if the user dislikes the song
            feedback.songDisliked = null;
        }
        return feedback;
    }

    public dislikeArtist(feedback: TrackFeedback): TrackFeedback {
        feedback.artistDisliked = true;
        if (feedback.artistLiked) {
            //We don't know if the user likes the artist
            feedback.artistLiked = null;
        }
        return feedback;
    }

    public likeArtist(feedback: TrackFeedback): TrackFeedback {
        feedback.artistLiked = true;
        if (feedback.artistDisliked) {
            //We don't know if the user dislikes the artist
            feedback.artistDisliked = null;
        }
        return feedback;
    }

    public dislikeSpeed(feedback: TrackFeedback): TrackFeedback {
        feedback.speedDisliked = true;
        if (feedback.speedLiked) {
            //We don't know if the user likes the speed
            feedback.speedLiked = null;
        }
        return feedback;
    }

    public likeSpeed(feedback: TrackFeedback): TrackFeedback {
        feedback.speedLiked = true;
        if (feedback.speedDisliked) {
            //We don't know if the user dislikes the speed
            feedback.speedDisliked = null;
        }
        return feedback;
    }

    public dislikeGenre(feedback: TrackFeedback): TrackFeedback {
        feedback.genreDisliked = true;
        if (feedback.genreLiked) {
            //We don't know if the user likes the genre
            feedback.genreLiked = null;
        }
        return feedback;
    }

    public likeGenre(feedback: TrackFeedback): TrackFeedback {
        feedback.genreLiked = true;
        if (feedback.genreDisliked) {
            //We don't know if the user dislikes the genre
            feedback.genreDisliked = null;
        }
        return feedback;
    }

    public dislikeDynamics(feedback: TrackFeedback): TrackFeedback {
        feedback.dynamicsDisliked = true;
        if (feedback.dynamicsLiked) {
            //We don't know if the user likes the dynamics
            feedback.dynamicsLiked = null;
        }
        return feedback;
    }

    public likeDynamics(feedback: TrackFeedback): TrackFeedback {
        feedback.dynamicsLiked = true;
        if (feedback.dynamicsDisliked) {
            //We don't know if the user dislikes the dynamics
            feedback.dynamicsDisliked = null;
        }
        return feedback;
    }

    public dislikeMood(feedback: TrackFeedback): TrackFeedback {
        feedback.moodDisliked = true;
        if (feedback.moodLiked) {
            //We don't know if the user likes the mood
            feedback.moodLiked = null;
        }
        return feedback;
    }

    public likeMood(feedback: TrackFeedback): TrackFeedback {
        feedback.moodLiked = true;
        if (feedback.moodDisliked) {
            //We don't know if the user dislikes the mood
            feedback.moodDisliked = null;
        }
        return feedback;
    }

    public postTrackFeedback(feedback: TrackFeedback): void {
        if (this.isTrackFeedbackValid(feedback)) {
            this.authHttp.post(this.feedbackUrl, feedback).subscribe((data: any) => {
            }, (error: Response) => {
                if (error.status == 500 && error.statusText == 'OK') {
                    console.warn('WARNING: UGLY CATCH OF 500 Error in postTrackFeedback!!!');
                } else {
                    console.warn('Sending feedback failed: ', error);
                }
            });

        }
    }

    /**
     * Posts a simple feedback containing radiostationID, songID, and a like or dislike for the given track to the backend
     * @param track track to give feedback to
     * @param like is the track liked? If false, the track will be disliked
     */
    public postSimpleFeedback(track: Track, like: boolean) {
        let feedback = this.createTrackFeedbackToTrack(track);
        if (like) {
            feedback = this.likeSong(feedback);
        } else {
            feedback = this.dislikeSong(feedback);
        }
        this.postTrackFeedback(feedback);
    }

    private isTrackFeedbackValid(feedback: TrackFeedback): boolean {

        return (feedback.radioId != null && feedback.trackId != null && (
        feedback.songLiked ||
        feedback.songDisliked ||
        feedback.artistLiked ||
        feedback.artistDisliked ||
        feedback.speedLiked ||
        feedback.speedDisliked ||
        feedback.genreLiked ||
        feedback.genreDisliked ||
        feedback.dynamicsLiked ||
        feedback.dynamicsDisliked ||
        feedback.periodLiked ||
        feedback.periodDisliked ||
        feedback.moodLiked ||
        feedback.moodDisliked));
    }

    public openTrackFeedbackDialog(track: Track): void {
        this.dialogRef = this.dialog.open(SpecialFeedbackDialogComponent);
        this.dialogRef.componentInstance.cTrack = track;
        this.dialogRef.componentInstance.cFeedback = this.createTrackFeedbackToTrack(track);
        this.dialogRef.afterClosed().subscribe((result: string) => {
            if (result == '1' || result == '2') {
                this.postTrackFeedback(this.dialogRef.componentInstance.cFeedback);
                if (result == '2') {
                    this.radiostationService.refreshTrackList();
                }
            }
            this.dialogRef = null;

        });
    }
}
