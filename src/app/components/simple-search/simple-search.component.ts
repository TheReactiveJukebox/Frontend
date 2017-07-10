/**
 * Created by David on 01.07.2017.
 */
import { Component } from '@angular/core';
import {SearchService} from '../../services/search.service';
import { Subject } from 'rxjs/Subject';
import {TrackService} from '../../services/track.service';
import {Track} from '../../models/track';
import {Observable} from 'rxjs/Observable';
import {AuthHttp} from '../../services/auth/auth-http';
import {Config} from '../../config';


@Component({
    selector: 'simple-search',
    templateUrl: './simple-search.component.html',
    styleUrls: ['./simple-search.component.scss'],
    providers: [SearchService]
})
export class SimpleSearchComponent {
    //The search result jsons and their length are stored here by category
    trackResult: Object;
    trackResultCount: number;

    artistResult: Object;
    artistResultCount: number;

    albumResult: Object;
    albumResultCount: number;

    //The trimmed searchTerm
    searchTerm: string;

    //Subjects to send the search terms to the service and to fetch results
    searchTrack$ = new Subject<string>();
    searchArtist$= new Subject<string>();
    searchAlbum$ = new Subject<string>();

    //Subscribing to the search result observables
    constructor(private searchService: SearchService,
                private trackService: TrackService,
                private authHttp: AuthHttp) {
        this.searchService.trackSearch(this.searchTrack$)
            .subscribe(results => {
                this.trackService.fillData(results).subscribe((filledTracks: Track[]) => {
                    this.trackResult = filledTracks;
                    this.trackResultCount = Object.keys(filledTracks).length;
                });
            });

        this.searchService.artistSearch(this.searchArtist$)
            .subscribe(results => {
                this.artistResult = results;
                this.artistResultCount = Object.keys(results).length;
            });
        this.searchService.albumSearch(this.searchAlbum$)
            .subscribe(results => {
                let artistUrl = Config.serverUrl + '/api/artist?';
                let artistRequests = [];
                for (let album of results) {
                    artistRequests.push(this.authHttp.get(artistUrl+'id='+album.artist));
                }
                Observable.forkJoin(artistRequests).subscribe((artistResults: any[]) => {
                    for (let i=0; i<results.length; i++) {
                        results[i].artist = artistResults[i][0];
                    }
                    this.albumResult = results;
                    this.albumResultCount = Object.keys(results).length;
                });
            });
    }

    //Invoked on keyup in search field search API is called when a query with more than two characters is send
    public searches(value):void {
        this.searchTerm = value.replace(/\s+/g, ''); //Remove whitespaces

        this.searchTrack$.next(this.searchTerm);
        this.searchArtist$.next(this.searchTerm);
        this.searchAlbum$.next(this.searchTerm);

    }


    //Invoked if user clicks on a search result
    public selection(value):void{
        console.log(JSON.stringify(value));
    }
}
