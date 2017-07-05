import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from './auth/auth-http';
import { Config } from '../config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class SearchService {

    //Third party API to test Observable functionality
    baseUrl: string = 'https://api.cdnjs.com/libraries';
    queryUrl: string = '?search=';


    constructor(private http: Http,private authHttp: AuthHttp) { }


    //Doesn't use our API. DELETE BEFORE MERGE
    thirdPartySearch(terms: Observable<string>) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.searchEntries(term));
    }

    trackSearch(terms: Observable<string>) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/track?titlesubstr='));
    }

    artistSearch(terms: Observable<string>) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/artist?namesubstr='));
    }

    albumSearch(terms: Observable<string>) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/album?titlesubstr='));
    }

    //DELETE WITH thirdPartySearch()
    searchEntries(term) {
        return this.http
            .get(this.baseUrl + this.queryUrl + term)
            .map(res => res.json());
    }

    // Function should call our API correctly
    apiCall(term, endpoint) {
        const url= Config.serverUrl + endpoint + term;
        console.log('Get API call: ' + url);
        return this.authHttp
            .get(Config.serverUrl + endpoint + term)
            ;
    }
}