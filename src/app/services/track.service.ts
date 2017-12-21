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
import {Moods} from '../models/moods';
import {TranslateService} from '@ngx-translate/core';
import {GenreFeedback} from '../models/genre-feedback';
import {LoggingService} from './logging.service';

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
    private trackUrl: string = Config.serverUrl + '/api/track';

    private fetchedSongs: Track[] = [];

    private isFetchingSongs: boolean = false;

    //DON'T TOUCH THIS VARIABLE! Use always the BehaviorSubject!
    private currTrack: Track = null;

    constructor(private authHttp: AuthHttp,
                private feedbackService: FeedbackService,
                private loggingService: LoggingService,
                private translateService: TranslateService) {
        this.init();
    }

    public init(): void {
        this.moods = new Moods(this.translateService, this.loggingService);
        this.currentTrack = new BehaviorSubject<Track>(null);
        this.nextTracks = new BehaviorSubject<Track[]>([]);
        this.artistCache = new Map<number, Artist>();
        this.albumCache = new Map<number, Album>();

        this.currentTrack.subscribe((track: Track) => {
           if (this.currTrack && this.currTrack.downloadSub) {
               this.currTrack.downloadSub.unsubscribe();
               this.currTrack.xhrRequest.abort();
           }
           this.currTrack = track;
        });
    }

    private getTracksFromCache(count: number, withCurrent: boolean): Observable<Track[]> {
        return Observable.create(observer => {
            if (this.fetchedSongs.length - count < 5 && !this.isFetchingSongs) {
                this.isFetchingSongs = true;
                let countToFetch = count < Config.numberFetchedSongs ? Config.numberFetchedSongs : count;
                let url = this.trackListUrl + '?count=' + countToFetch;
                //inculde tracks that are in the current listening queue
                if (withCurrent) {
                    if (this.currentTrack.getValue()) {
                        url += '&upcoming=' + this.currentTrack.getValue().id;
                    }
                    for (let track of this.nextTracks.getValue()) {
                        url += '&upcoming=' + track.id;
                    }
                }
                for (let track of this.fetchedSongs) {
                    url += '&upcoming=' + track.id;
                }

                this.authHttp.get(url).subscribe((tracks: Track[]) => {
                    if (tracks.length > 0) {
                        for (let i = 0; i < tracks.length; i++) {
                            tracks[i].file = Config.serverUrl + '/music/' + tracks[i].file;
                        }
                        this.fillMetaData(tracks).subscribe((filledTracks: Track[]) => {
                            this.fetchedSongs = this.fetchedSongs.concat(filledTracks);
                            this.isFetchingSongs = false;
                            observer.next(this.fetchedSongs.splice(0, count));
                            observer.complete();
                        });
                    } else {
                        this.isFetchingSongs = false;
                        observer.next(this.fetchedSongs.splice(0, count));
                        observer.complete();
                    }
                }, error => {
                    this.isFetchingSongs = false;
                    //TODO HANDLE THIS
                });

            } else {
                if (this.isFetchingSongs) {
                    this.loggingService.warn(this, 'We are running out of tracks');
                }
                observer.next(this.fetchedSongs.splice(0, count));
                observer.complete();
            }
        });
    }

    //Refreshes current track and track preview according to current radiostation
    public refreshCurrentAndUpcomingTracks(): void {
        this.fetchedSongs = [];
        this.getNewSongs(this.numberUpcomingSongs + 1, true).subscribe((tracks: Track[]) => {
            this.currentTrack.next(tracks[0]);
            this.nextTracks.next(tracks.slice(1));
        }, error => {
            this.loggingService.error(this, 'Error fetching new songs!', error);
        });
    }

    //Refreshes current Tracklist
    public refreshUpcomingTracks(): void {
        this.fetchedSongs = [];
        this.getNewSongs(this.numberUpcomingSongs + 1, false).subscribe((tracks: Track[]) => {
            this.nextTracks.next(tracks.slice(1));
        }, error => {
            this.loggingService.error(this, 'Error refreshing tracklist!', error);
        });
    }


    public getNewSongs(count: number, withCurrent: boolean): Observable<Track[]> {
        return Observable.create(observer => {
            this.getTracksFromCache(count, withCurrent).subscribe((tracks: Track[]) => {
                if (tracks.length > 0) {
                    observer.next(this.fillMusicData(tracks));
                    observer.complete();
                }
            });
        });
    }

    public fillMetaData(rawTracks: any): Observable<Track[]> {
        return Observable.create(observer => {
            let artistIds: number[] = [];
            let albumIds: number[] = [];
            let genres: string[][] = [];
            for (let rawTrack of rawTracks) {
                if (rawTrack.releaseDate) {
                    rawTrack.releaseDate = new Date(rawTrack.releaseDate);
                }
                artistIds.push(rawTrack.artist);
                albumIds.push(rawTrack.album);
                if (rawTrack.arousal && rawTrack.valence) {
                    rawTrack.mood = this.moods.getMood(rawTrack.arousal, rawTrack.valence);
                }
                genres.push(rawTrack.genres);
            }
            // get missing artists and albums from server
            Observable.forkJoin([
                this.getArtistsByIdsFromCache(artistIds),
                this.getAlbumsByIdsFromCache(albumIds),
                this.feedbackService.fetchGenreFeedback(genres)]).subscribe((data: any[]) => {
                // data[0] = requested artists, data[1] = requested albums

                let artists: Artist[] = data[0];
                let albums: Album[] = data[1];
                let genreFeedbacks: GenreFeedback[][] = data[2];

                for (let i = 0; i < rawTracks.length; i++) {
                    rawTracks[i].artist = artists[i];
                    rawTracks[i].album = albums[i];
                    rawTracks[i].genres = genreFeedbacks[i];
                }

                observer.next(rawTracks);
                observer.complete();
            });
        });
    }

    private requestEntities(url: string, ids: number[]): Observable<any[]> {
        return Observable.create(observer => {
            if (ids.length > 0) {
                let reqUrl = url + '?';
                for (let id of ids) {
                    reqUrl += 'id=' + id + '&';
                }
                reqUrl = reqUrl.substring(0, reqUrl.length - 1);
                this.authHttp.get(reqUrl).subscribe((entities: any[]) => {
                    observer.next(entities);
                    observer.complete();
                }, error => {
                    if (error.status == 500 && error.statusText == 'OK') {
                        this.loggingService.warn(this, 'UGLY CATCH OF 500 Error in requestEntities!');
                        observer.next(JSON.parse(error._body));
                        observer.complete();
                    } else {
                        observer.error(error);
                        observer.complete();
                    }
                });
            } else {
                observer.next([]);
                observer.complete();
            }
        });
    }

    //Fetches music files of tracks from the server
    public fillMusicData(tracks: Track[]): Track[] {
        for (let track of tracks) {
            track.readyToPlay = new BehaviorSubject(false);
            let requestData = this.authHttp.getTrack(track.file);
            track.xhrRequest = requestData[1];
            track.downloadSub = requestData[0].subscribe((data) => {
                track.data = data;
                track.readyToPlay.next(true);
            });
        }
        return tracks;
    }

    //Gets the next track from the preview and adds the next track to the preview list
    public nextSong(): Track {
        if (this.nextTracks.getValue().length > 0) {
            let tempTracks: Track[] = this.nextTracks.getValue();
            this.currentTrack.next(tempTracks[0]);
            let nextTrack: Track = tempTracks[0];
            tempTracks = tempTracks.slice(1);
            this.nextTracks.next(tempTracks);
            //Get new Track
            this.getNewSongs(this.numberUpcomingSongs - this.nextTracks.getValue().length, true).subscribe((tracks: Track[]) => {
                for (let t of tracks) {
                    tempTracks.push(t);
                }
                this.nextTracks.next(tempTracks);
            }, error => {
                this.loggingService.error(this, 'Error in nextSong!', error);
            });
            return nextTrack;
        } else {
            return null;
        }
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
        this.getNewSongs(removed, true).subscribe((tracks: Track[]) => {
            newTracks.push(tracks[0]);
            this.nextTracks.next(newTracks);
        }, error => {
            this.loggingService.error(this, 'Error in removeTrack!', error);
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

            this.getNewSongs(removed + 1, true).subscribe((tracks: Track[]) => {
                let newTracks: Track[] = this.nextTracks.getValue();
                newTracks.splice(0, removed);
                this.currentTrack.next(newTracks[0]);
                newTracks = newTracks.slice(1);
                tracks.forEach(function (newTrack: Track): void {
                    newTracks.push(newTrack);
                });
                this.nextTracks.next(newTracks);
            }, error => {
                this.loggingService.error(this, 'Error in jumpToTrack!', error);
            });
        }
        return track;
    }

    public loadTracksByIds(ids: number[]): Observable<Track[]> {
        return Observable.create(observer => {
            this.requestEntities(this.trackUrl , ids).subscribe(rawTracks => {
                this.fillMetaData(rawTracks).subscribe((tracks: Track[]) => {
                    observer.next(tracks);
                    observer.complete();
                });
            });
        });
    }
    
    public getArtistsByIdsFromCache(ids: number[]): Observable<Artist[]> {
        return Observable.create(observer => {
            let missingArtists: number[] = [];
            for (let id of ids) {
                if (!this.artistCache.has(id)) {
                    missingArtists.push(id);
                }
            }
            this.requestEntities(this.artistUrl, missingArtists).subscribe((data: any[]) => {
                let artists: Artist[] = data;
                for (let i = 0; i < artists.length; i++) {
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

    public getAlbumsByIdsFromCache(ids: number[]): Observable<Album[]> {
        return Observable.create(observer => {
            let missingAlbums: number[] = [];
            for (let id of ids) {
                if (!this.albumCache.has(id)) {
                    missingAlbums.push(id);
                }
            }
            this.requestEntities(this.albumUrl, missingAlbums).subscribe((data: any[]) => {
                let albums: Album[] = data;
                for (let i = 0; i < albums.length; i++) {
                    this.albumCache.set(albums[i].id, albums[i]);
                }
                let requestedAlbums: Album[] = [];
                for (let id of ids) {
                    requestedAlbums.push(this.albumCache.get(id));
                }
                observer.next(requestedAlbums);
                observer.complete();
            });
        });
    }
}
