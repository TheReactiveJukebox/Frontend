/**
 * This service takes care of feedback
 */
import {Injectable} from '@angular/core';
import {Config} from '../config';
import {Track} from '../models/track';
import {TrackFeedback} from '../models/track-feedback';
import {AuthHttp} from './auth/auth-http';
import {ArtistFeedback} from '../models/artist-feedback';
import {AlbumFeedback} from '../models/album-feedback';
import {GenreFeedback} from '../models/genre-feedback';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FeedbackService {

    private feedbackUrl: string = Config.serverUrl + '/api/track/feedback';  // URL to web api
    private artistFeedbackUrl: string = Config.serverUrl + '/api/artist/feedback';
    private albumFeedbackUrl: string = Config.serverUrl + '/api/album/feedback';
    // private genreFeedbackUrl: string = Config.serverUrl + '/api/genre/feedback';

    private genreFeedbackCache: Map<string, GenreFeedback>;

    constructor(private authHttp: AuthHttp) {
        this.genreFeedbackCache = new Map<string, GenreFeedback>();
    }

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

    public fetchArtistFeedback(artistIds: number[]):  Observable<ArtistFeedback[]> {
        return this.requestEntities(this.artistFeedbackUrl, artistIds);
    }

    public fetchAlbumFeedback(albumIds: number[]):  Observable<AlbumFeedback[]> {
        return this.requestEntities(this.albumFeedbackUrl, albumIds);
    }

    private requestEntities(url: string, ids: number[]): Observable<any[]> {
        if (ids.length > 0) {
            let reqUrl = url + '?';
            for (let id of ids) {
                reqUrl += 'id=' + id + '&';
            }
            reqUrl = reqUrl.substring(0, reqUrl.length - 1);
            return this.authHttp.get(reqUrl);
        } else {
            return Observable.create(observer => {
                observer.next([]);
                observer.complete();
            });
        }
    }
}
