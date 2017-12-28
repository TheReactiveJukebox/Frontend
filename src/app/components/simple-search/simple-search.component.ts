/**
 * Created by David on 01.07.2017.
 */
import {Component, EventEmitter, Output} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Track} from '../../models/track';
import {AuthHttp} from '../../services/auth/auth-http';
import {SearchService} from '../../services/search.service';
import {TrackService} from '../../services/track.service';
import {Artist} from '../../models/artist';
import {Config} from '../../config';


@Component({
    selector: 'simple-search',
    templateUrl: './simple-search.component.html',
    styleUrls: ['./simple-search.component.scss'],
    providers: [SearchService]
})
export class SimpleSearchComponent {

    // emits every clicked item
    @Output()
    public selectedItem: EventEmitter<any> = new EventEmitter<any>();

    // emits every clicked item
    @Output()
    public selectedAlbum: EventEmitter<any> = new EventEmitter<any>();

    // emits every clicked item
    @Output()
    public selectedArtist: EventEmitter<any> = new EventEmitter<any>();

    // emits every clicked item
    @Output()
    public selectedTrack: EventEmitter<any> = new EventEmitter<any>();

    //The search result jsons and their length are stored here by category
    public trackResult: Object;
    public trackResultCount: number;

    public artistResult: Object;
    public artistResultCount: number;

    public albumResult: Object;
    public albumResultCount: number;

    public trackLimit: number = Config.trackSearchResultLimit;
    public albumLimit: number = Config.albumSearchResultLimit;
    public artistLimit: number = Config.artistSearchResultLimit;

    //The trimmed searchTerm
    public searchTerm: string;

    //Subjects to send the search terms to the service and to fetch results
    private searchTrack$: Subject<string> = new Subject<string>();
    private searchArtist$: Subject<string> = new Subject<string>();
    private searchAlbum$: Subject<string> = new Subject<string>();
    private getArtistSongs$: Subject<string> = new Subject<string>();
    private getAlbumSongs$: Subject<string> = new Subject<string>();

    //Subscribing to the search result observables
    constructor(private searchService: SearchService,
                private trackService: TrackService,
                private authHttp: AuthHttp) {
        this.searchTerm = '';
        this.searchService.trackSearch(this.searchTrack$)
            .subscribe(results => {
                if (Object.keys(results).length > 0) {
                    results = results.slice(0, Config.trackSearchResultLimit);
                    this.trackService.fillMetaData(results).subscribe((filledTracks: Track[]) => {
                        this.trackResult = filledTracks;
                        this.trackResultCount = Object.keys(filledTracks).length;
                    });
                } else {
                    this.trackResult = results;
                    this.trackResultCount = 0;
                }
            });

        this.searchService.artistSearch(this.searchArtist$)
            .subscribe(results => {
                this.artistResult = results;
                this.artistResultCount = Object.keys(results).length;
            });
        this.searchService.albumSearch(this.searchAlbum$)
            .subscribe(results => {
                if (Object.keys(results).length > 0) {
                    results = results.slice(0, Config.albumSearchResultLimit);
                    let artistIds: number[] = [];
                    for (let album of results) {
                        artistIds.push(album.artist);
                    }
                    this.trackService.getArtistsByIdsFromCache(artistIds).subscribe((artists: Artist[]) => {
                        for (let i = 0; i < results.length; i++) {
                            results[i].artist = artists[i];
                        }
                        this.albumResult = results;
                        this.albumResultCount = Object.keys(results).length;
                    });
                } else {
                    this.albumResult = results;
                    this.albumResultCount = 0;
                }
            });
        //Gets songs for an artist
        this.searchService.getArtistSongs(this.getArtistSongs$)
            .subscribe(results => {
                if (Object.keys(results).length > 0) {
                    results = results.slice(0, Config.trackSearchResultLimit);
                    this.trackService.fillMetaData(results).subscribe((filledTracks: Track[]) => {
                        this.trackResult = filledTracks;
                        this.trackResultCount = Object.keys(filledTracks).length;
                        this.artistResultCount = 0;
                        this.albumResultCount = 0;
                    });
                } else {
                    this.trackResult = results;
                    this.trackResultCount = 0;
                }
            });

        this.searchService.getAlbumSongs(this.getAlbumSongs$)
            .subscribe(results => {
                if (Object.keys(results).length > 0) {
                    this.trackService.fillMetaData(results).subscribe((filledTracks: Track[]) => {
                        this.trackResult = filledTracks;
                        this.trackResultCount = Object.keys(filledTracks).length;
                        this.artistResultCount = 0;
                        this.albumResultCount = 0;
                    });
                } else {
                    this.trackResult = results;
                    this.trackResultCount = 0;
                }
            });
    }

    //Invoked on keyup in search field search API is called when a query with more than two characters is send
    public searches(value: string): void {
        this.searchTerm = value.replace(/\s+/g, ''); //Remove whitespaces

        this.searchTrack$.next(this.searchTerm);
        this.searchArtist$.next(this.searchTerm);
        this.searchAlbum$.next(this.searchTerm);
    }

    public discography(value: string): void {
        this.getArtistSongs$.next(value);
    }

    public album(value: string): void {
        this.getAlbumSongs$.next(value);
    }


    //Invoked if user clicks on a search result
    public selection(value: any, type: string): void {
        switch (type) {
            case 'ARTIST': this.selectedArtist.emit(value);
                break;
            case 'ALBUM': this.selectedAlbum.emit(value);
                break;
            case 'TRACK': this.selectedTrack.emit(value);
                break;
        }
        this.selectedItem.emit(value);
    }

    public hasResults(): boolean {
        return (this.trackResultCount + this.albumResultCount + this.artistResultCount) > 0;
    }
}
