/**
 * @author Florian Scholz
 *
 * This Service handles user authentication and holds the session token.
 */

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, Request, RequestOptions, RequestOptionsArgs, RequestMethod } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { CookieService } from 'ngx-cookie';
import { Config } from '../../config';

@Injectable()
export class AuthService {

    // session token
    private token: string;

    // contains true, if user is logged in, otherwise it contains false
    private loggedIn: BehaviorSubject<any>;

    constructor(private http: Http, private cookieService: CookieService) {
        this.loggedIn = new BehaviorSubject(false);
    }

    // returns user's loggedin status as Observable
    getLoggedIn (): Observable<boolean> {
        return this.loggedIn.asObservable();
    }

    // returns true, if user is logged in, otherwise false.
    isLoggedIn (): boolean {
        return this.loggedIn.getValue();
    }

    //performs an autologin with stored session-cookie.
    public performAutoLogin(): Observable<any> {
        return new Observable(observer => {
            this.token = this.cookieService.get('rjb-sessionToken');
            if (this.token) { // check if there is any token to send to the server, otherwise abort the autologin
                this.loginWithToken(this.token).subscribe(result => {
                    observer.next(result);
                    observer.complete();
                }, error => {
                    observer.error();
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
            url: Config.serverUrl + '/api/auth/auto',
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
            url: Config.serverUrl + '/api/auth/login',
            method: RequestMethod.Post,
            search: null,
            headers: new Headers(),
            body: {'userData': userData}
        };

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return this.http.request(req, reqOptions).
            map((res: Response) => res.json()).
            map((user: any) => {
                this.authorize(user);
                return user;
        });
    }

    // logout. Notify the server and remove the cookie.
    public logout(): Observable<any> {
        let basicOptions: RequestOptionsArgs = {
            url: Config.serverUrl + '/api/auth/logout',
            method: RequestMethod.Post,
            search: null,
            headers: new Headers(),
            body: null
        };

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);
        this.loggedIn.next(false);
        this.cookieService.remove('sessionToken');

        return this.http.request(req, reqOptions).
            map((res: Response) => {
                return res;
            } );
    }

    // Register a new user
    public registerUser(userData: any): Observable<any> {
        let basicOptions: RequestOptionsArgs = {
            url: Config.serverUrl + '/api/auth/register',
            method: RequestMethod.Post,
            search: null,
            headers: new Headers(),
            body: {'user': JSON.stringify(userData)}
        };

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return this.http.request(req, reqOptions).
        map((res: Response) =>  res.json()).
        map((user: any) => {
          this.authorize(user);
          return user;
        });
    }

    // store the token in app and store it as cookie
    public authorize(result: any): void {
        this.token = result.token;
        this.loggedIn.next(true);
        this.cookieService.put('rjb-sessionToken', this.token);
    }

    // returns user's current session token.
    public getToken(): string {
        return this.token;
    }

}
