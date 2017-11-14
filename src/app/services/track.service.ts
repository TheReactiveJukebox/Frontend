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

@Injectable()
export class TrackService {

    currentTrack: BehaviorSubject<Track>;
    nextTracks: BehaviorSubject<Track[]>;
    numberUpcomingSongs: number = 5;

    // dataCache for artists and albums. Before requesting any data from server, check if it's still here. if not, store
    // it here to reduce waiting for backend
    private artistCache: Map<number, Artist>;
    private albumCache: Map<number, Album>;

    private trackListUrl: string = Config.serverUrl + '/api/jukebox/next';  // URL to web api
    private artistUrl: string = Config.serverUrl + '/api/artist';
    private albumUrl: string = Config.serverUrl + '/api/album';

    constructor(private authHttp: AuthHttp) {
        this.currentTrack = new BehaviorSubject<Track>(null);
        this.nextTracks = new BehaviorSubject<Track[]>([]);
        this.artistCache = new Map<number, Artist>();
        this.albumCache = new Map<number, Album>();
    }

    //Refreshes current track and track preview according to current radiostation
    refreshTracks(): void {
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
    refreshTrackList(): void {
        this.fetchNewSongs(this.numberUpcomingSongs + 1, false).subscribe((tracks: Track[]) => {
            this.nextTracks.next(tracks.slice(1));
        }, error => {
            console.log('Error refreshing tracklist: ', error);
        });
    }

    fetchNewSongs(count: number, withCurrent: boolean): Observable<Track[]> {
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
                    this.fillData(tracks).subscribe((filledTracks: Track[]) => {
                        observer.next(filledTracks);
                        observer.complete();
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
                        this.fillData(tracks).subscribe((filledTracks: Track[]) => {
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

    // use this method to fill plain track objects provided by server with artist and album data
    fillData(rawTracks: any[]): Observable<Track[]> {
        return Observable.create(observer => {
            let missingArtists: number[] = [];
            let missingAlbums: number[] = [];
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
            }
            // get missing artists and albums from server
            Observable.forkJoin([
                this.requestEntities(this.artistUrl, missingArtists),
                this.requestEntities(this.albumUrl, missingAlbums)]).subscribe((data: any[]) => {
                // data[0] = requested artists, data[1] = requested albums
                console.log('DATA: ', data);
                let artists: Artist[] = data[0];
                let albums: Album[] = data[1];
                for (let artist of artists) {
                    this.artistCache.set(artist.id, artist);
                }
                for (let album of albums) {
                    this.albumCache.set(album.id, album);
                }

                for (let rawTrack of rawTracks) {
                    rawTrack.artist = this.artistCache.get(rawTrack.artist);
                    rawTrack.album = this.albumCache.get(rawTrack.album);
                }
                observer.next(rawTracks);
                observer.complete();
            });
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

    //Gets the next track from the preview and adds the next track to the preview list
    nextSong(): Track {
        let tempTracks: Track[] = this.nextTracks.getValue();
        this.currentTrack.next(tempTracks[0]);
        let nextTrack: Track = tempTracks[0];
        tempTracks = tempTracks.slice(1);
        this.nextTracks.next(tempTracks);
        //Get new Track
        this.fetchNewSongs(1, true).subscribe((tracks: Track[]) => {
            tempTracks.push(tracks[0]);
            this.nextTracks.next(tempTracks);
        }, error => {
            console.log('Error in nextSong(): ', error);
        });
        return nextTrack;
    }


    hasNextTracks(): boolean {
        return (this.currentTrack.getValue() != null) ||
            (this.nextTracks.getValue() != null && this.nextTracks.getValue().length > 0);
    }


    /**
     * removes the given track from the tracklist
     * @param track to remove
     */
    removeTrack(track: Track): void {
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
    jumpToTrack(track: Track): Track {
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
}
