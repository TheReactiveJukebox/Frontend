/**
 * Created by David on 01.07.2017.
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Config } from '../config';
import { AuthHttp } from './auth/auth-http';


@Injectable()
export class SearchService {

    private static MIN_QUERY_LENGTH = 1;

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

    getArtistSongs(terms: Observable<string>) {
        return terms.debounceTime(200)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/track?artist='));
    }

    getAlbumSongs(terms: Observable<string>) {
        return terms.debounceTime(200)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/track?album='));
    }

    // Function should call our API correctly
    apiCall(term: string, endpoint) {
        let count = '';
        if (term.length < SearchService.MIN_QUERY_LENGTH) {
            count = 'xxtzt?count=0';
        }
        const url = Config.serverUrl + endpoint + term + count;
        console.log('Get API call: ' + url);
        return this.authHttp.get(url);
    }
}
