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

    refreshTracks(): void {
        const url = `${this.trackListUrl}?count=6`;

        this.authHttp.get(url).subscribe((tracks: Track[]) => {
            if (tracks.length > 0) {
                for(let i=0;i<tracks.length;i++){
                    tracks[i].file = Config.serverUrl +'/music/'+tracks[i].file;
                }
                this.currentTrack.next(tracks[0]);
                this.nextTracks.next(tracks.slice(1));
            }
        });
    }

    nextSong(): void {
        let tempTracks: Track[] = this.nextTracks.getValue();
        this.currentTrack.next(tempTracks[0]);
        tempTracks.slice(1);

        //get new Track
        const url = `${this.trackListUrl}?count=1`;

        this.authHttp.get(url).subscribe((tracks: Track[]) => {
            if (tracks.length > 0) {
                let newTrack: Track = tracks[0];
                newTrack.file = Config.serverUrl +'/music/'+newTrack.file;
                tempTracks.push(newTrack);
            }
        });


        this.nextTracks.next(tempTracks);


    }
}
