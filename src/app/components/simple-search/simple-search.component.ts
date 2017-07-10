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

    //Invoked on keyup in search field search API is called when a query with more than two characters is send
    public searches(value):void {
        this.searchTerm = value.replace(/\s+/g, ''); //Remove whitespaces
        if(this.searchTerm.length>=2){
            this.searchTrack$.next(this.searchTerm);
            this.searchArtist$.next(this.searchTerm);
            this.searchAlbum$.next(this.searchTerm);
        }
        else{
            this.trackResultCount = this.artistResultCount = this.albumResultCount = 0;
        }
    }


    //Invoked if user clicks on a search result
    public selection(value):void{
        console.log(JSON.stringify(value));
    }
}
