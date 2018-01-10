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
import {LoggingService} from './logging.service';
import {SpeedFeedback} from '../models/speed-feedback';
import {MoodFeedback} from '../models/mood-feedback';

@Injectable()
export class FeedbackService {

    private feedbackUrl: string = Config.serverUrl + '/api/track/feedback';  // URL to web api
    private artistFeedbackUrl: string = Config.serverUrl + '/api/artist/feedback';
    private albumFeedbackUrl: string = Config.serverUrl + '/api/album/feedback';
    private genreFeedbackUrl: string = Config.serverUrl + '/api/genre/feedback';
    private speedFeedbackUrl: string = Config.serverUrl + '/api/tempo/feedback';
    private moodFeedbackUrl: string = Config.serverUrl + '/api/mood/feedback';

    private genreFeedbackCache: Map<string, GenreFeedback>;
    private speedFeedbackCache: Map<number, SpeedFeedback>;
    private moodFeedbackCache: Map<number, MoodFeedback>;

    constructor(private authHttp: AuthHttp, private loggingService: LoggingService) {

    }

    public init(): void {
        this.genreFeedbackCache = new Map<string, GenreFeedback>();
        this.speedFeedbackCache = new Map<number, SpeedFeedback>();
        this.moodFeedbackCache = new Map<number, MoodFeedback>();
        this.authHttp.get(this.speedFeedbackUrl).subscribe((data: SpeedFeedback[]) => {
           for (let feedback of data) {
               this.speedFeedbackCache.set(feedback.fSpeed, feedback);
               console.log('FEEDBACK: ', feedback);
           }
        }, error => {
            this.loggingService.error(this, 'Fetching speed feedback failed!', error);
        });

        this.authHttp.get(this.moodFeedbackUrl).subscribe((data: MoodFeedback[]) => {
            for (let feedback of data) {
                this.moodFeedbackCache.set(feedback.fMood, feedback);
                console.log('FEEDBACK: ', feedback);
            }
        }, error => {
            this.loggingService.error(this, 'Fetching speed feedback failed!', error);
        });
    }

    public postTrackFeedback(track: Track): void {
        this.authHttp.post(this.feedbackUrl, track.feedback).subscribe((data: TrackFeedback) => {

        }, (error) => {
            this.loggingService.error(this, 'Sending track feedback failed!', error);
        });
    }

    public postSpeedFeedback(track: Track): void {
        this.authHttp.post(this.speedFeedbackUrl, track.speedFeedback).subscribe((data: SpeedFeedback) => {

        }, (error) => {
            this.loggingService.error(this, 'Sending speed feedback failed!', error);
        });
    }

    public postMoodFeedback(track: Track): void {
        this.authHttp.post(this.moodFeedbackUrl, track.moodFeedback).subscribe((data: TrackFeedback) => {

        }, (error) => {
            this.loggingService.error(this, 'Sending mood feedback failed!', error);
        });
    }

    public postArtistFeedback(track: Track): Observable<any> {
        return this.authHttp.post(this.artistFeedbackUrl, track.artist.feedback);
    }

    public postGenreFeedback(genre: GenreFeedback): Observable<any> {
        return this.authHttp.post(this.genreFeedbackUrl, genre);
    }

    public postAlbumFeedback(track: Track): void {
        this.authHttp.post(this.albumFeedbackUrl, track.album.feedback).subscribe((data: AlbumFeedback) => {

        }, (error) => {
            this.loggingService.error(this, 'Sending feedback failed!', error);
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
                        if (this.genreFeedbackCache.get(genre)) {
                            feedbackObjects.push(this.genreFeedbackCache.get(genre));
                        } else {
                            observer.error('Cache miss for genre ' + genre + '! This should not happen!');
                            this.loggingService.error(this, 'Cache miss for genre ' + genre + '!');
                        }
                    }
                    result.push(feedbackObjects);
                }
                observer.next(result);
                observer.complete();
            }, error => {
                this.loggingService.error(this, 'Failed to request Entities for fetchGenreFeedback!', error);
                observer.error(error);
            });
        });
    }

    private addGenreFeedbackToCache(feedbacks: GenreFeedback[]): void {
        for (let feedback of feedbacks) {
            this.genreFeedbackCache.set(feedback.genre, feedback);
        }
    }

    private requestEntities(url: string, ids: any[]): Observable<any[]> {
        if (ids.length > 0) {
            let reqUrl = url + '?';
            for (let id of ids) {
                reqUrl += 'id=' + encodeURIComponent(id) + '&';
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

    public getSpeedFeedback(fSpeed: number): SpeedFeedback {
        let cachedFeedback = this.speedFeedbackCache.get(fSpeed);
        if (cachedFeedback) {
            return cachedFeedback;
        } else {
            let newFeedback: SpeedFeedback = {
                feedback: 0,
                fSpeed: fSpeed
            };
            this.speedFeedbackCache.set(fSpeed, newFeedback);
            return newFeedback;
        }
    }

    public getMoodFeedback(fMood: number): MoodFeedback {
        let cachedFeedback = this.moodFeedbackCache.get(fMood);
        if (cachedFeedback) {
            return cachedFeedback;
        } else {
            let newFeedback: MoodFeedback = {
                feedback: 0,
                fMood: fMood
            };
            this.moodFeedbackCache.set(fMood, newFeedback);
            return newFeedback;
        }
    }
}
