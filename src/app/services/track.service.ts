/**
 * This service takes care of the current track and the track preview
 */
import {Injectable} from '@angular/core';
import {Track} from '../models/track';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Config} from '../config';
import {AuthHttp} from './auth/auth-http';
import {Observable} from 'rxjs/Observable';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
import {RadiostationService} from './radiostation.service';

@Injectable()
export class TrackService {

    currentTrack: BehaviorSubject<Track>;
    nextTracks: BehaviorSubject<Track[]>;

    private trackListUrl = Config.serverUrl + '/api/jukebox/next';  // URL to web api

    constructor(private authHttp: AuthHttp) {
        this.currentTrack = new BehaviorSubject<Track>(null);
        this.nextTracks = new BehaviorSubject<Track[]>(null);
    }

    //Refreshes current track and track preview according to current radiostation
    refreshTracks(): void {
        this.fetchNewSongs(6).subscribe((tracks: Track[]) => {
            this.currentTrack.next(tracks[0]);
            this.nextTracks.next(tracks.slice(1));
        }, error => {
            console.log(error);
        });
    }

    fetchNewSongs(count: number): Observable<Track[]> {
        return Observable.create(observer => {
            const url = this.trackListUrl + '?count=' + count;
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

    /*fillData(rawTracks: Track[]): Observable<Track[]> {
        return Observable.create(observer => {
            let artistUrl = Config.serverUrl + '/api/artist?';
            let albumUrl = Config.serverUrl + '/api/album?';
            for (let rawTrack of rawTracks) {
                artistUrl += 'id=' + rawTrack.artist + '&';
                albumUrl += 'id=' + rawTrack.album + '&';
            }
            this.authHttp.get(artistUrl).subscribe((data: Artist[]) => {
                for (let i = 0; i < rawTracks.length; i++) {
                    rawTracks[i].artist = data[i];
                }
                this.authHttp.get(albumUrl).subscribe((albums: Album[]) => {
                    for (let i = 0; i < rawTracks.length; i++) {
                        rawTracks[i].album = albums[i];
                    }
                    observer.next(rawTracks);
                    observer.complete();
                });
            });
        });
    }*/

    fillData(rawTracks: Track[]): Observable<Track[]> {
        return Observable.create(observer => {
            let artistUrl = Config.serverUrl + '/api/artist?';
            let albumUrl = Config.serverUrl + '/api/album?';
            let artistRequests = [];
            let albumRequests = [];
            for (let rawTrack of rawTracks) {
                artistRequests.push(this.authHttp.get(artistUrl+'id='+rawTrack.artist));
            }
            Observable.forkJoin(artistRequests).subscribe((artistResults: any[]) => {
                for (let rawTrack of rawTracks) {
                    albumRequests.push(this.authHttp.get(albumUrl+'id='+rawTrack.album));
                }
                Observable.forkJoin(albumRequests).subscribe((albumResults: any[]) => {
                    for (let i=0; i<rawTracks.length; i++) {
                        rawTracks[i].artist = artistResults[i][0];
                        rawTracks[i].album = albumResults[i][0];
                    }
                    observer.next(rawTracks);
                    observer.complete();
                });
            });
        });
    }

    //Gets the next track from the preview and adds the next track to the preview list
    nextSong(): void {
        let tempTracks: Track[] = this.nextTracks.getValue();
        this.currentTrack.next(tempTracks[0]);
        tempTracks = tempTracks.slice(1);

        //Get new Track
        this.fetchNewSongs(1).subscribe((tracks: Track[]) => {
            tempTracks.push(tracks[0]);
            this.nextTracks.next(tempTracks);
        }, error => {
            console.log(error);
        });
    }

    hasNextTracks(): boolean {
        return (this.nextTracks.getValue() != null && this.nextTracks.getValue().length > 0);
    }
}
