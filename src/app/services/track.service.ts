/**
 * This service takes care of the current track and the track preview
 */
import {Injectable} from '@angular/core';
import {Track} from '../models/track';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Config} from '../config';
import {AuthHttp} from './auth/auth-http';

@Injectable()
export class TrackService {

    currentTrack: BehaviorSubject<Track>;
    nextTracks: BehaviorSubject<Track[]>;

    private trackListUrl = Config.serverUrl + '/api/jukebox/next';  // URL to web api

    constructor(private authHttp: AuthHttp) {
        this.currentTrack = new BehaviorSubject<Track>(null);
        this.nextTracks = new BehaviorSubject<Track[]>([]);
    }

    //Refreshes current track and track preview according to current radiostation
    refreshTracks(): void {
        const url = `${this.trackListUrl}?count=6`;

        this.authHttp.get(url).subscribe((tracks: Track[]) => {
            if (tracks.length > 0) {
                for (let i = 0; i < tracks.length; i++) {
                    tracks[i].file = Config.serverUrl + '/music/' + tracks[i].file;
                }
                this.currentTrack.next(tracks[0]);
                this.nextTracks.next(tracks.slice(1));
            }
        });
    }

    //Gets the next track from the preview and adds the next track to the preview list
    nextSong(): void {
        let tempTracks: Track[] = this.nextTracks.getValue();
        this.currentTrack.next(tempTracks[0]);
        tempTracks = tempTracks.slice(1);

        //Get new Track
        const url = `${this.trackListUrl}?count=1`;

        this.authHttp.get(url).subscribe((tracks: Track[]) => {
            if (tracks.length > 0) {
                let newTrack: Track = tracks[0];
                newTrack.file = Config.serverUrl + '/music/' + newTrack.file;
                tempTracks.push(newTrack);
            }
        });
        this.nextTracks.next(tempTracks);
    }

    hasNextTracks(): boolean {
        return (this.nextTracks.getValue() != null && this.nextTracks.getValue().length > 0);
    }
}
