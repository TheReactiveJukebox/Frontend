/**
 * This service takes care of the current track and the track preview
 */
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Config} from '../config';
import {Album} from '../models/album';
import {Artist} from '../models/artist';
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';
import {FeedbackService} from './feedback.service';
import {ArtistFeedback} from '../models/artist-feedback';
import {AlbumFeedback} from '../models/album-feedback';
import {Moods} from '../models/moods';
import {TranslateService} from '@ngx-translate/core';
import {GenreFeedback} from '../models/genre-feedback';

@Injectable()
export class TrackService {

    public currentTrack: BehaviorSubject<Track>;
    public nextTracks: BehaviorSubject<Track[]>;
    public moods: Moods;
    private numberUpcomingSongs: number = Config.numberUpcomingSongs;

    // dataCache for artists and albums. Before requesting any data from server, check if it's still here. if not, store
    // it here to reduce waiting for backend
    private artistCache: Map<number, Artist>;
    private albumCache: Map<number, Album>;

    private trackListUrl: string = Config.serverUrl + '/api/jukebox/next';  // URL to web api
    private artistUrl: string = Config.serverUrl + '/api/artist';
    private albumUrl: string = Config.serverUrl + '/api/album';

    constructor(private authHttp: AuthHttp,
                private feedbackService: FeedbackService,
                private translateService: TranslateService) {
        this.moods = new Moods(translateService);
        this.currentTrack = new BehaviorSubject<Track>(null);
        this.nextTracks = new BehaviorSubject<Track[]>([]);
        this.artistCache = new Map<number, Artist>();
        this.albumCache = new Map<number, Album>();
    }

    //Refreshes current track and track preview according to current radiostation
    public refreshCurrentAndUpcomingTracks(): void {
        this.fetchNewSongs(this.numberUpcomingSongs + 1, true).subscribe((tracks: Track[]) => {
            this.currentTrack.next(tracks[0]);
            this.nextTracks.next(tracks.slice(1));
            /*
             this.fillMusicData(tracks).subscribe((filledTracks: Track[]) => {
             for (let i = 0; i < tracks.length; i++) {
             tracks[i].data = filledTracks[i].data;
             }
             });
             */
        }, error => {
            console.log('Error fetching new songs: ', error);
        });
    }


    //Refreshes current Tracklist
    public refreshUpcomingTracks(): void {
        this.fetchNewSongs(this.numberUpcomingSongs + 1, false).subscribe((tracks: Track[]) => {
            this.nextTracks.next(tracks.slice(1));
        }, error => {
            console.log('Error refreshing tracklist: ', error);
        });
    }

    public fetchNewSongs(count: number, withCurrent: boolean): Observable<Track[]> {
        return Observable.create(observer => {
            let url = this.trackListUrl + '?count=' + count;
            //inculde tracks that are in the current listening queue
            if (withCurrent) {
                if (this.currentTrack.getValue()) {
                    url += '&upcoming=' + this.currentTrack.getValue().id;
                }
                for (let track of this.nextTracks.getValue()) {
                    url += '&upcoming=' + track.id;
                }
            }

            this.authHttp.get(url).subscribe((tracks: Track[]) => {
                if (tracks.length > 0) {
                    for (let i = 0; i < tracks.length; i++) {
                        tracks[i].file = Config.serverUrl + '/music/' + tracks[i].file;
                    }
                    this.fillMetaData(tracks).subscribe((filledTracks: Track[]) => {
                        console.log('FILLED TRACKS:!!!! ', filledTracks);
                        tracks = filledTracks;
                        observer.next(filledTracks);
                        this.fillMusicData(tracks).subscribe((dataFilledTracks: Track[]) => {
                            filledTracks = dataFilledTracks;
                            observer.complete();
                        });
                    });
                }
            }, error => {
                if (error.status == 500 && error.statusText == 'OK') {
                    console.warn('WARNING: UGLY CATCH OF 500 Error in fetchNewSongs!!!');
                    let tracks: any[] = JSON.parse(error._body);
                    if (tracks.length > 0) {
                        for (let i = 0; i < tracks.length; i++) {
                            tracks[i].file = Config.serverUrl + '/music/' + tracks[i].file;
                        }
                        this.fillMetaData(tracks).subscribe((filledTracks: Track[]) => {
                            console.log('FILLED TRACKS:!!!! ', filledTracks);
                            observer.next(filledTracks);
                            observer.complete();
                        });
                    }
                } else {
                    observer.error(error);
                    observer.complete();
                }
            });
        });
    }

    public fillMetaData(rawTracks: any): Observable<Track[]> {
        return Observable.create(observer => {
            let missingArtists: number[] = [];
            let missingAlbums: number[] = [];
            let genres: string[][] = [];
            for (let rawTrack of rawTracks) {
                if (rawTrack.releaseDate) {
                    rawTrack.releaseDate = new Date(rawTrack.releaseDate);
                }
                if (!this.artistCache.has(rawTrack.artist)) {
                    missingArtists.push(rawTrack.artist);
                }
                if (!this.albumCache.has(rawTrack.album)) {
                    missingAlbums.push(rawTrack.album);
                }
                if (rawTrack.arousal && rawTrack.valence) {
                    rawTrack.mood = this.moods.getMood(rawTrack.arousal, rawTrack.valence);
                }
                genres.push(rawTrack.genres);
            }
            // get missing artists and albums from server
            Observable.forkJoin([
                this.requestEntities(this.artistUrl, missingArtists),
                this.requestEntities(this.albumUrl, missingAlbums),
                this.feedbackService.fetchGenreFeedback(genres)]).subscribe((data: any[]) => {
                // data[0] = requested artists, data[1] = requested albums
                console.log('DATA: ', data);
                let artists: Artist[] = data[0];
                let albums: Album[] = data[1];
                let genreFeedbacks: GenreFeedback[][] = data[2];

                let newArtistIds: number[] = this.getObjectIds(artists);
                let newAlbumIds: number[] = this.getObjectIds(albums);

                // fetch feedback for new artists and albums
                Observable.forkJoin([
                    this.feedbackService.fetchArtistFeedback(newArtistIds),
                    this.feedbackService.fetchAlbumFeedback(newAlbumIds),
                ]).subscribe((feedbackData: any[]) => {
                    let artistFeedbacks: ArtistFeedback[] = feedbackData[0];
                    let albumFeedbacks: AlbumFeedback[] = feedbackData[1];

                    for (let i = 0; i < artists.length; i++) {
                        artists[i].feedback = artistFeedbacks[i];
                        this.artistCache.set(artists[i].id, artists[i]);
                    }

                    for (let i = 0; i < albums.length; i++) {
                        albums[i].feedback = albumFeedbacks[i];
                        this.albumCache.set(albums[i].id, albums[i]);
                    }

                    for (let i = 0; i < rawTracks.length; i++) {
                        rawTracks[i].artist = this.artistCache.get(rawTracks[i].artist);
                        rawTracks[i].album = this.albumCache.get(rawTracks[i].album);
                        rawTracks[i].genres = genreFeedbacks[i];
                    }

                    observer.next(rawTracks);
                    observer.complete();
                });
            });
        });
    }

    private getObjectIds(objects: any[]): number[] {
        return objects.map(function (obj: any): number {
            return obj.id;
        });
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

    //Fetches music files of tracks from the server
    public fillMusicData(tracks: Track[]): Observable<Track[]> {
        return Observable.create(observer => {
            let dataRequests = [];
            for (let track of tracks) {
                dataRequests.push(this.authHttp.getTrack(track.file));
            }
            Observable.forkJoin(dataRequests).subscribe((dataResults: any[]) => {
                for (let i = 0; i < tracks.length; i++) {
                    //simulate Download Delay
                    //setTimeout(() => console.log('Music data loaded:' + tracks[i].file), 2000);
                    tracks[i].data = dataResults[i];
                }
                observer.next(tracks);
                observer.complete();
            }, err => {
                console.log('GET TRACK ERROR: ', err);
            });
        });
    }

    //Gets the next track from the preview and adds the next track to the preview list
    public nextSong(): Track {
        let tempTracks: Track[] = this.nextTracks.getValue();
        this.currentTrack.next(tempTracks[0]);
        let nextTrack: Track = tempTracks[0];
        tempTracks = tempTracks.slice(1);
        this.nextTracks.next(tempTracks);
        //Get new Track
        this.fetchNewSongs(this.numberUpcomingSongs - this.nextTracks.getValue().length, true).subscribe((tracks: Track[]) => {
            for (let t of tracks) {
                tempTracks.push(t);
            }
            this.nextTracks.next(tempTracks);
        }, error => {
            console.log('Error in nextSong(): ', error);
        });
        return nextTrack;
    }

    public hasNextTracks(): boolean {
        return (this.currentTrack.getValue() != null) ||
            (this.nextTracks.getValue() != null && this.nextTracks.getValue().length > 0);
    }


    /**
     * removes the given track from the tracklist
     * @param track to remove
     */
    public removeTrack(track: Track): void {
        let currentTracks: Track[] = this.nextTracks.getValue();
        let newTracks: Track[] = new Array(currentTracks.length - 1);
        let removed = 0;
        for (let i = 0; i < currentTracks.length; i++) {
            if (currentTracks[i].id != track.id) {
                newTracks[i - removed] = currentTracks[i];
            } else {
                removed = 1;
            }
        }

        //Get new Track
        this.fetchNewSongs(removed, true).subscribe((tracks: Track[]) => {
            newTracks.push(tracks[0]);
            this.nextTracks.next(newTracks);
        }, error => {
            console.log('Error in removeTrack(): ', error);
        });
    }

    /**
     * jumps to given track
     * skips/remove all tracks between current and choosen track
     * @param track to jump to
     */
    public jumpToTrack(track: Track): Track {
        let currentTracks: Track[] = this.nextTracks.getValue();
        let removedTracks: Track[] = new Array();
        let removed = 0;
        //fill removedTracks array
        for (let i = 0; i < currentTracks.length; i++) {
            if (currentTracks[i].id != track.id) {
                removedTracks[removed] = currentTracks[i];
                removed++;
            } else {
                break;
            }
        }

        //Get #removed + 1 new tracks, +1 because current track is skipped
        if (removed >= 0) {

            this.fetchNewSongs(removed + 1, true).subscribe((tracks: Track[]) => {
                let newTracks: Track[] = this.nextTracks.getValue();
                newTracks.splice(0, removed);
                this.currentTrack.next(newTracks[0]);
                newTracks = newTracks.slice(1);
                tracks.forEach(function (newTrack: Track): void {
                    newTracks.push(newTrack);
                });
                this.nextTracks.next(newTracks);
            }, error => {
                console.log('Error in jumpToTrack(): ', error);
            });
        }
        return track;
    }

    public getArtistsByIds(ids: number[]): Observable<Artist[]> {
        return Observable.create(observer => {
            let missingArtists: number[] = [];
            for (let id of ids) {
                if (!this.artistCache.has(id)) {
                    missingArtists.push(id);
                }
            }
            let requests = [this.requestEntities(this.artistUrl, missingArtists), this.feedbackService.fetchArtistFeedback(missingArtists)];
            Observable.forkJoin(requests).subscribe((data: any[]) => {
                let artists: Artist[] = data[0];
                let feedbacks: ArtistFeedback[] = data[1];
                for (let i = 0; i < artists.length; i++) {
                    artists[i].feedback = feedbacks[1];
                    this.artistCache.set(artists[i].id, artists[i]);
                }
                let requestedArtists: Artist[] = [];
                for (let id of ids) {
                    requestedArtists.push(this.artistCache.get(id));
                }
                observer.next(requestedArtists);
                observer.complete();
            });
        });
    }
}
