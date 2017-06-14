import { Injectable } from '@angular/core';
import { Track } from '../models/track';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Config } from '../config';
import { AuthHttp } from './auth/auth-http';

@Injectable()
export class TrackService {
    currentTrack: BehaviorSubject<Track>;
    nextTracks: BehaviorSubject<Track[]>;

    private trackListUrl = Config.serverUrl + '/api/track/list';  // URL to web api

    constructor(private authHttp: AuthHttp) {
        this.currentTrack = new BehaviorSubject<Track>(null);
        this.nextTracks = new BehaviorSubject<Track[]>([]);
    }

    refreshTracks(): void {
        const url = `${this.trackListUrl}/6`;

        this.authHttp.get(url).subscribe((tracks: Track[]) => {
            if (tracks.length > 0) {
                this.currentTrack.next(tracks[0]);
                this.nextTracks.next(tracks.slice(1));
            }
        });

        //use the following for testing UI without backend
        // Promise.resolve(MOCK_TITLES).then(tracks => {
        //     if (tracks.length > 0) {
        //         this.currentTrack = tracks[0];
        //         this.nextTracks = tracks.slice(1);
        //     }
        // });
    }

    // unused, but maybe useful. at the moment just a example for setting observables
    // call this to set the next song as 'current'
    nextSong(): void {
        let tempTracks: Track[] = this.nextTracks.getValue();
        this.currentTrack.next(tempTracks[0]);
        tempTracks.slice(1);
        this.nextTracks.next(tempTracks);
    }
}
