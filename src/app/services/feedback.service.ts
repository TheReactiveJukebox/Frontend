/**
 * This service takes care of the playback control.
 */
import {Injectable} from '@angular/core';
import {TrackService} from './track.service';

@Injectable()
export class FeedbackService {


    constructor(private trackService: TrackService) {

    }

    public like(): void {
        //TODO: push like to server with current song information
    }

    public dislike(): void {
        //TODO: push dislike to server with current song information
    }

    public getSpecialFeedback(): void {
        //TODO show dialog and send result to server
    }


}
