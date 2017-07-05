/**
 * Created by David on 01.07.2017.
 */
import { Component } from '@angular/core';
import {SearchService} from '../../services/search.service';
import { Subject } from 'rxjs/Subject';


@Component({
    selector: 'simple-search',
    templateUrl: './simple-search.component.html',
    styleUrls: ['./simple-search.component.scss'],
    providers: [SearchService]
})
export class SimpleSearchComponent {
    trackResult: Object;
    trackResultCount: number;

    artistResult: Object;
    artistResultCount: number;

    albumResult: Object;
    albumResultCount: number;

    searchTerm: string;

    searchTrack$ = new Subject<string>();
    searchArtist$= new Subject<string>();
    searchAlbum$ = new Subject<string>();

    constructor(private searchService: SearchService) {
        this.searchService.trackSearch(this.searchTrack$)
            .subscribe(results => {
                this.trackResult = results;
                this.trackResultCount = Object.keys(results).length;
            });

        this.searchService.artistSearch(this.searchArtist$)
            .subscribe(results => {
                this.artistResult = results;
                this.artistResultCount = Object.keys(results).length;
            });
        this.searchService.albumSearch(this.searchAlbum$)
            .subscribe(results => {
                this.albumResult = results;
                this.albumResultCount = Object.keys(results).length;
            });
    }

    public searches(value):void {
        this.searchTerm = value.replace(/\s+/g, ''); //Remove whitespaces
        this.searchTrack$.next(this.searchTerm);
        this.searchArtist$.next(this.searchTerm);
        this.searchAlbum$.next(this.searchTerm);
    }

    public selection(value):void{
        console.log(JSON.stringify(value));
    }
}
