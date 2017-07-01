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

    //Search parameters for our API call
    queryParam: string = '?titlesubstr='

    constructor(private http: Http,private authHttp: AuthHttp) { }

    titleSearch(terms: Observable<string>) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.searchEntries(term));
    }
    artistSearch(terms: Observable<string>) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.apiCall(term, '/api/artist'));
    }

    searchEntries(term) {
        return this.http
            .get(this.baseUrl + this.queryUrl + term)
            .map(res => res.json());
    }

    // Function should call our API correctly
    apiCall(term, endpoint) {
        return this.authHttp
            .get(Config.serverUrl + endpoint + this.queryParam + term)
            .map(res => res.json());
    }
}