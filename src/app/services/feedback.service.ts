/**
 * This service takes care of feedback
 */
import {Injectable} from '@angular/core';
import {Config} from '../config';
import {Track} from '../models/track';
import {TrackFeedback} from '../models/track-feedback';
import {AuthHttp} from './auth/auth-http';

@Injectable()
export class FeedbackService {

    private feedbackUrl: string = Config.serverUrl + '/api/track/feedback';  // URL to web api

    constructor(private authHttp: AuthHttp) {}

    public postTrackFeedback(track: Track): void {
        this.authHttp.post(this.feedbackUrl, track.trackFeedback).subscribe((data: TrackFeedback) => {
            track.trackFeedback = data;
        }, (error) => {
            if (error.status == 500 && error.statusText == 'OK') {
                console.warn('WARNING: UGLY CATCH OF 500 Error in postTrackFeedback!!!');
                track.trackFeedback = error._body;
            } else {
                console.warn('Sending feedback failed: ', error);
            }
        });
    }
}
