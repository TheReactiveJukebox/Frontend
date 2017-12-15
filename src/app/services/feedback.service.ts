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
    private genreFeedbackUrl: string = Config.serverUrl + '/api/genre/feedback';

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
                track.trackFeedback = JSON.parse(error._body);
            } else {
                console.warn('Sending track feedback failed: ', error);
            }
        });
    }

    public postArtistFeedback(track: Track): void {
        this.authHttp.post(this.artistFeedbackUrl, track.artist.feedback).subscribe((data: ArtistFeedback) => {
            track.artist.feedback = data;
        }, (error) => {
            if (error.status == 500 && error.statusText == 'OK') {
                console.warn('WARNING: UGLY CATCH OF 500 Error in postTrackFeedback!!!');
                track.artist.feedback = JSON.parse(error._body);
            } else {
                console.warn('Sending artist feedback failed: ', error);
            }
        });
    }

    public postGenreFeedback(track: Track): void {
        this.authHttp.post(this.genreFeedbackUrl, track.genres[0]).subscribe((data: GenreFeedback) => {
            track.genres[0] = data;
            this.genreFeedbackCache.set(data.genre, data);
        }, (error) => {
            if (error.status == 500 && error.statusText == 'OK') {
                console.warn('WARNING: UGLY CATCH OF 500 Error in postTrackFeedback!!!');
                track.genres[0] = error._body;
                this.genreFeedbackCache.set(JSON.parse(error._body).genre, JSON.parse(error._body));
            } else {
                console.warn('Sending genre feedback failed: ', error);
            }
        });
    }

    public postAlbumFeedback(track: Track): void {
        this.authHttp.post(this.albumFeedbackUrl, track.album.feedback).subscribe((data: AlbumFeedback) => {
            track.album.feedback = data;
        }, (error) => {
            if (error.status == 500 && error.statusText == 'OK') {
                console.warn('WARNING: UGLY CATCH OF 500 Error in postTrackFeedback!!!');
                track.album.feedback = JSON.parse(error._body);
            } else {
                console.warn('Sending feedback failed: ', error);
            }
        });
    }

    public fetchGenreFeedback(genres: string[][]):  Observable<GenreFeedback[][]> {
        let allGenres: Set<string> = new Set<string>();
        for (let trackGenres of genres) {
            for (let genre of trackGenres) {
                allGenres.add(genre);
            }
        }
        let missingGenres: string[] = [];
        allGenres.forEach((genre) => {
            if (!this.genreFeedbackCache.has(genre)) {
                missingGenres.push(genre);
            }
        });

        return Observable.create(observer => {
            this.requestEntities(this.genreFeedbackUrl, missingGenres).subscribe((data: GenreFeedback[]) => {
                this.addGenreFeedbackToCache(data);
                let result: any[] = [];
                for (let trackGenres of genres) {
                    let feedbackObjects: GenreFeedback[] = [];
                    for (let genre of trackGenres) {
                        feedbackObjects.push(this.genreFeedbackCache.get(genre));
                    }
                    result.push(feedbackObjects);
                }
                observer.next(result);
                observer.complete();
            }, error => {
                if (error.status == 500 && error.statusText == 'OK') {
                    console.warn('WARNING: UGLY CATCH OF 500 Error in fetchArtistFeedback!!!');
                    this.addGenreFeedbackToCache(JSON.parse(error._body));
                    let result: any[] = [];
                    for (let trackGenres of genres) {
                        let feedbackObjects: GenreFeedback[] = [];
                        for (let genre of trackGenres) {
                            feedbackObjects.push(this.genreFeedbackCache.get(genre));
                        }
                        result.push(feedbackObjects);
                    }
                    observer.next(result);
                    observer.complete();
                } else {
                    observer.error(error);
                }
            });
        });
    }

    private addGenreFeedbackToCache(feedbacks: GenreFeedback[]): void {
        for (let feedback of feedbacks) {
            this.genreFeedbackCache.set(feedback.genre, feedback);
        }
    }

    public fetchArtistFeedback(artistIds: number[]):  Observable<ArtistFeedback[]> {
        return Observable.create(observer => {
            this.requestEntities(this.artistFeedbackUrl, artistIds).subscribe((data: ArtistFeedback[]) => {
                observer.next(data);
                observer.complete();
            }, error => {
                if (error.status == 500 && error.statusText == 'OK') {
                    console.warn('WARNING: UGLY CATCH OF 500 Error in fetchArtistFeedback!!!');
                    observer.next(JSON.parse(error._body));
                    observer.complete();
                } else {
                    observer.error(error);
                }
            });
        });
    }

    public fetchAlbumFeedback(albumIds: number[]):  Observable<AlbumFeedback[]> {
        return Observable.create(observer => {
            this.requestEntities(this.albumFeedbackUrl, albumIds).subscribe((data: AlbumFeedback[]) => {
                observer.next(data);
                observer.complete();
            }, error => {
                if (error.status == 500 && error.statusText == 'OK') {
                    console.warn('WARNING: UGLY CATCH OF 500 Error in fetchAlbumFeedback!!!');
                    observer.next(JSON.parse(error._body));
                    observer.complete();
                } else {
                    observer.error(error);
                }
            });
        });
    }

    private requestEntities(url: string, ids: any[]): Observable<any[]> {
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
