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

    private dislikeSong(feedback: TrackFeedback): TrackFeedback {
        feedback.songFeedback = -1;
        return feedback;
    }

    private likeSong(feedback: TrackFeedback): TrackFeedback {
        feedback.songFeedback = 1;
        return feedback;
    }

    public postTrackFeedback(feedback: TrackFeedback): void {
        this.authHttp.post(this.feedbackUrl, feedback).subscribe((data: any) => {
        }, (error: Response) => {
            if (error.status == 500 && error.statusText == 'OK') {
                console.warn('WARNING: UGLY CATCH OF 500 Error in postTrackFeedback!!!');
            } else {
                console.warn('Sending feedback failed: ', error);
            }
        });
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
