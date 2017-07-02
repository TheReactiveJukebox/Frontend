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
    artistResult: Object;
    albumResult: Object;

    searchTrack$ = new Subject<string>();
    searchArtist$= new Subject<string>();
    searchAlbum$ = new Subject<string>();

    constructor(private searchService: SearchService) {
        this.searchService.thirdPartySearch(this.searchTrack$)
            .subscribe(results => {
                this.trackResult = results.results;
            });

        this.searchService.thirdPartySearch(this.searchArtist$)
            .subscribe(results => {
                this.artistResult = results.results;
            });
        this.searchService.thirdPartySearch(this.searchAlbum$)
            .subscribe(results => {
                this.albumResult = results.results;
            });
    }

    public searches(value):void {
        this.searchTrack$.next(value);
        this.searchArtist$.next(value+'e');
        this.searchAlbum$.next(value+'a');
    }
}
