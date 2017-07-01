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
    results1: Object;
    results2: Object;
    searchTerm$ = new Subject<string>();
    searchTerm2$= new Subject<string>();

    constructor(private searchService: SearchService) {
        this.searchService.titleSearch(this.searchTerm$)
            .subscribe(results => {
                this.results1 = results.results;
            });

        this.searchService.titleSearch(this.searchTerm2$)
            .subscribe(results => {
                this.results2 = results.results;
            });
    }

    public searches(value):void {
        this.searchTerm$.next(value);
        console.log('Did Search Term');
        this.searchTerm2$.next(value+'e');
    }
}
