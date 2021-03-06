/**
 * This Service handles user authentication and holds the session token.
 */

import {Injectable} from '@angular/core';
import {Headers, Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {CookieService} from 'ngx-cookie';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/Rx';
import {Config} from '../../config';

@Injectable()
export class AuthService {

    // session token
    private token: string;

    // contains true, if user is logged in, otherwise it contains false
    private loggedIn: BehaviorSubject<any>;

    // this is needed for study-mode. in other cases we don't need a username
    private authorizedUser: BehaviorSubject<any>;

    constructor(private http: Http, private cookieService: CookieService) {
        this.loggedIn = new BehaviorSubject(false);
        this.authorizedUser = new BehaviorSubject(null);
    }

    // returns user's loggedin status as Observable
    public getLoggedIn (): Observable<boolean> {
        return this.loggedIn.asObservable();
    }

    // returns true, if user is logged in, otherwise false.
    public isLoggedIn (): boolean {
        return this.loggedIn.getValue();
    }

    //performs an autologin with stored session-cookie.
    public performAutoLogin(): Observable<any> {
        return new Observable(observer => {
            let data: string = this.cookieService.get('rjb-sessionToken');
            if (data) { // check if there is any token to send to the server, otherwise abort the autologin
                this.token = data;
                this.loginWithToken(this.token).subscribe(result => {
                    observer.next(result);
                    observer.complete();
                }, error => {
                    observer.error(error);
                    observer.complete();
                });
            } else {
                observer.error('No auto-login token in storage!');
                observer.complete();
            }
        });
    }

    // Send the token to the server to check, if it is valid
    private loginWithToken (token: String): Observable<any> {
        let basicOptions: RequestOptionsArgs = {
            url: Config.serverUrl + '/api/user/autologin',
            method: RequestMethod.Post,
            search: null,
            headers: new Headers(),
            body: {token: token}
        };

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return this.http.request(req, reqOptions).
        map((res: Response) =>  res.json()).
        map((result: any) => {
            this.authorize(result);
            return result;
        });
    }

    // login with username and password
    public login (userData: any): Observable<any> {
        let basicOptions: RequestOptionsArgs = {
            url: Config.serverUrl + '/api/user/login',
            method: RequestMethod.Post,
            search: null,
            headers: new Headers(),
            body: userData
        };

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return this.http.request(req, reqOptions).
            map((res: Response) => res.json()).
            map((token: any) => {
                this.authorize(token);
                return token;
        });
    }

    // logout. Notify the server and remove the cookie.
    public logout(): void {
        let basicOptions: RequestOptionsArgs = {
            url: Config.serverUrl + '/api/user/logout',
            method: RequestMethod.Post,
            search: null,
            headers: new Headers(),
            body: {token: this.token}
        };

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);
        this.loggedIn.next(false);
        this.token = null;
        this.cookieService.remove('rjb-sessionToken');
        location.reload();

        this.http.request(req, reqOptions).subscribe(() => {
        }, error => {
            console.log('[AuthService] Tried to notify server about logout, but failed!', error);
        });
    }

    // Register a new user
    public registerUser(userData: any): Observable<any> {
        let basicOptions: RequestOptionsArgs = {
            url: Config.serverUrl + '/api/user/register',
            method: RequestMethod.Post,
            search: null,
            headers: new Headers(),
            body: userData
        };

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return this.http.request(req, reqOptions).
        map((res: Response) =>  res.json()).
        map((token: any) => {
          this.authorize(token);
          return token;
        });
    }

    // store the token in app and store it as cookie
    public authorize(user: any): void {
        this.token = user.token;
        this.authorizedUser.next(user);
        this.loggedIn.next(true);
        this.cookieService.put('rjb-sessionToken', this.token);
    }

    // returns user's current session token.
    public getToken(): string {
        return this.token;
    }

    public getUser(): any {
        return this.authorizedUser.getValue();
    }

}
