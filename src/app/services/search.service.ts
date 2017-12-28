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

    private static MIN_QUERY_LENGTH: number = 1;

    constructor(private authHttp: AuthHttp) { }

    /*
    The three API search calls are made via switchMap to enhance the server response order.
    This makes incremental searches faster.
     */


    //TODO: Transfer endpoint paths to a separate API class
    public trackSearch(terms: Observable<string>): Observable<any> {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/track?titlesubstr='));
    }

    public artistSearch(terms: Observable<string>): Observable<any> {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/artist?namesubstr='));
    }

    public albumSearch(terms: Observable<string>): Observable<any> {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/album?titlesubstr='));
    }

    public getArtistSongs(terms: Observable<string>): Observable<any> {
        return terms.debounceTime(200)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/track?artist='));
    }

    public getAlbumSongs(terms: Observable<string>): Observable<any> {
        return terms.debounceTime(200)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/track?album='));
    }

    // Function should call our API correctly
    public apiCall(term: string, endpoint: string): Observable<any> {
        let count = '';
        if (term.length < SearchService.MIN_QUERY_LENGTH) {
            count = 'xxtzt?count=0';
        }
        const url = Config.serverUrl + endpoint + term + count;
        return this.authHttp.get(url);
    }
}
