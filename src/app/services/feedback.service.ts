/**
 * This service takes care of feedback
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Config} from '../config';
import {Track} from '../models/track';
import {TrackFeedback} from '../models/track-feedback';
import {AuthHttp} from './auth/auth-http';

@Injectable()
export class FeedbackService {

    private feedbackUrl: string = Config.serverUrl + '/api/track/feedback';  // URL to web api

    constructor(private authHttp: AuthHttp) {}

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

    public postTrackFeedback(feedback: TrackFeedback): Observable<TrackFeedback> {
        return Observable.create(observer => {
            this.authHttp.post(this.feedbackUrl, feedback).subscribe((data: TrackFeedback) => {
                observer.next(data);
                observer.complete();
            }, (error) => {
                if (error.status == 500 && error.statusText == 'OK') {
                    console.warn('WARNING: UGLY CATCH OF 500 Error in postTrackFeedback!!!');
                    observer.next(error._body);
                    observer.complete();
                } else {
                    console.warn('Sending feedback failed: ', error);
                    observer.error(error);
                }
            });
        });
    }

    /**
     * Posts a simple feedback containing radiostationID, songID, and a like or dislike for the given track to the backend
     * @param track track to give feedback to
     * @param like is the track liked? If false, the track will be disliked
     */
    public postSimpleFeedback(track: Track, like: boolean): void {
        let feedback = this.createTrackFeedbackToTrack(track);
        if (like) {
            feedback = this.likeSong(feedback);
        } else {
            feedback = this.dislikeSong(feedback);
        }
        this.postTrackFeedback(feedback).subscribe();
    }

}
