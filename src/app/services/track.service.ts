import { Injectable } from '@angular/core';
import { Track } from '../models/track';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

//MOCK_TITLES used for frontend testing without backend
const MOCK_TITLES: Track[] = [
    { id: 1, title: 'Kryptonite', artist: '3 Doors Down', album: 'The Better Life - Deluxe Edition', cover: 'https://s3.amazonaws.com/images.sheetmusicdirect.com/Album/ca8a8ef7-f305-374a-833b-b8f621ede068/large.jpg', duration: 233 },
    { id: 2, title: 'Hells Bells', artist: 'AC/DC', album: 'Back in Black', cover: 'https://upload.wikimedia.org/wikipedia/en/2/23/HellsBells.jpg', duration: 312 },
    { id: 3, title: 'Paint it Black', artist: 'The Rolling Stones', album: 'Singles 1965-1967', cover: 'http://www.covermesongs.com/wp-content/uploads/2010/09/PaintItBlack-400x400.jpg', duration: 224 },
    { id: 4, title: 'Wonderwall', artist: 'Oasis', album: '[What\'s the Story] Morning Glory?', cover: 'https://upload.wikimedia.org/wikipedia/en/1/17/Wonderwall_cover.jpg', duration: 258 },
    { id: 5, title: 'Evil Ways', artist: 'Santana', album: 'Santana (Legacy Edition)', cover: 'https://upload.wikimedia.org/wikipedia/en/8/84/Santana_-_Santana_%281969%29.png', duration: 238 },
    { id: 6, title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Greatest Hits', cover: 'https://upload.wikimedia.org/wikipedia/en/1/15/Guns_N%27_Roses_-_Sweet_Child_o%27_Mine.png', duration: 355 },
    { id: 7, title: 'Come As You Are', artist: 'Nirvana', album: 'Nevermind (Deluxe Edition)', cover: 'http://e.snmc.io/lk/f/l/e3aee4167b67150f78c352a0e4d129e5/3736618.jpg', duration: 218 },
    { id: 8, title: 'Bodies', artist: 'Drowning Pool', album: 'Sinner', cover: 'https://upload.wikimedia.org/wikipedia/en/4/49/Drowning_Pool-Bodies_CD_Cover.jpg', duration: 201 },
    { id: 9, title: 'Crocodile Rock', artist: 'Elton John', album: 'Don\'t Shooot Me I\'m Only The Piano Player', cover: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Elton_John_Crocodile_Rock_%282%29.jpg', duration: 235 },
    { id: 10, title: 'I Was Made For Loving You', artist: 'KISS', album: 'Dynasty (Remastered Version)', cover: 'http://streamd.hitparade.ch/cdimages/kiss-i_was_made_for_lovin_you_s.jpg', duration: 217 },
    { id: 11, title: 'Come Out and Play', artist: 'The Offspring', album: 'Smash', cover: 'https://upload.wikimedia.org/wikipedia/en/8/80/TheOffspringSmashalbumcover.jpg', duration: 197 },
    { id: 12, title: 'Rock & Roll Queen', artist: 'The Subways', album: 'Young For Eternity', cover: 'https://images-na.ssl-images-amazon.com/images/I/41T42C5YFEL.jpg', duration: 169 },
];

@Injectable()
export class TrackService {
    currentTrack: BehaviorSubject<Track>;
    nextTracks: BehaviorSubject<Track[]>;

    private trackListUrl = 'http://localhost:8080/api/track/list';  // URL to web api

    constructor(private http: Http) {
        this.currentTrack = new BehaviorSubject<Track>(null);
        this.nextTracks = new BehaviorSubject<Track[]>([]);
    }

    refreshTracks(): void {
        const url = `${this.trackListUrl}/6`;

        this.http.get(url).subscribe((response: Response) => {
            let tracks = response.json() as Track[];
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
