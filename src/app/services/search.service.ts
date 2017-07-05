/**
 * Created by David on 01.07.2017.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from './auth/auth-http';
import { Config } from '../config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class SearchService {

    constructor(private authHttp: AuthHttp) { }

    /*
    The three API search calls are made via switchMap to enhance the server response order.
    This makes incremental searches faster.
     */


    //TODO: Transfer endpoint paths to a separate API class
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

    // Function should call our API correctly
    apiCall(term, endpoint) {
        const url= Config.serverUrl + endpoint + term;
        console.log('Get API call: ' + url);
        return this.authHttp.get(url);
    }
}