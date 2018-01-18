/**
 * This class is an extension of Angular's Http-module to perform authorized requests to our REST-Api.
 */

import {Injectable} from '@angular/core';
import {Headers, Http, Request, RequestMethod, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';
import {Observer} from 'rxjs/Observer';

@Injectable()
export class AuthHttp {

    constructor(private http: Http, private authService: AuthService) {

    }

    /*
     * Basic request method. This method adds the authentication token to each request, before the request is sent to
     * the server.
     */
    public request(request: Request, options?: RequestOptionsArgs): Observable<Response> {
        request.headers.append('Authorization', 'Bearer ' + this.authService.getToken());
        return this.http.request(request, options);
    }

    public getTrack(url: string): [Observable<any>, XMLHttpRequest] {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        return [Observable.create((observer: Observer<any>) => {
            xhr.onreadystatechange = function(): void {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.response == null) {
                       observer.error('XHR Request is ready and status 200, but response is still empty! Awesome, Firefox!');
                    } else {
                        observer.next(window.URL.createObjectURL(this.response));
                        observer.complete();
                    }
                }
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.authService.getToken());
            xhr.send();
        }), xhr];
    }

    /**
     * Performs a authenticated request with `get` http method.
     * @param url: The Url to the REST-Api
     */
    public get(url: string): Observable<any> {
        let basicOptions: RequestOptionsArgs = {
            url: url,
            method: RequestMethod.Get,
            headers: new Headers(),
            search: null,
            body: null
        };
        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return Observable.create((observer: Observer<any>) => {
            this.request(req, reqOptions).subscribe((res: Response) => {
                observer.next(res.json());
                observer.complete();
            }, error => {
                if (error.status == 500 && error.statusText == 'OK') {
                    try {
                        let object = JSON.parse(error._body);
                        console.warn('[AuthHttp] UGLY CATCH OF 500 ERROR in get!');
                        observer.next(object);
                        observer.complete();
                    } catch (e) {
                        observer.error(error);
                    }
                } else {
                    observer.error(error);
                }
            });
        });
    }

    /**
     * Performs a authenticated request with `post` http method.
     * @param url: The Url to the REST-Api
     * @param body: Any content, that should be sent to the server.
     */
    public post(url: string, body: any): Observable<any> {
        let basicOptions: RequestOptionsArgs = {
            url: url,
            method: RequestMethod.Post,
            search: null,
            headers: new Headers(),
            body: body
        };

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return Observable.create((observer: Observer<any>) => {
            this.request(req, reqOptions).subscribe((res: Response) => {
                observer.next(res.json());
                observer.complete();
            }, error => {
                if (error.status == 500 && error.statusText == 'OK') {
                    try {
                        let object = JSON.parse(error._body);
                        console.warn('[AuthHttp] UGLY CATCH OF 500 ERROR in post!');
                        observer.next(object);
                        observer.complete();
                    } catch (e) {
                        observer.error(error);
                    }
                } else {
                    observer.error(error);
                }
            });
        });
    }

    /**
     * Performs a authenticated request with `put` http method.
     * @param url: The Url to the REST-Api
     * @param body: Any content, that should be sent to the server.
     */
    public put(url: string, body: any): Observable<any> {
        let basicOptions: RequestOptionsArgs = {
            url: url,
            method: RequestMethod.Put,
            search: null,
            headers: new Headers(),
            body: body
        };

        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return Observable.create((observer: Observer<any>) => {
            this.request(req, reqOptions).subscribe((res: Response) => {
                observer.next(res.json());
                observer.complete();
            }, error => {
                if (error.status == 500 && error.statusText == 'OK') {
                    try {
                        let object = JSON.parse(error._body);
                        console.warn('[AuthHttp] UGLY CATCH OF 500 ERROR in put!');
                        observer.next(object);
                        observer.complete();
                    } catch (e) {
                        observer.error(error);
                    }
                } else {
                    observer.error(error);
                }
            });
        });
    }

    /**
     * Performs a authenticated request with `delete` http method.
     * Can not be named `delete` because that is a reserved name.
     * @param url: The Url to the REST-Api
     */
    public http_delete(url: string): Observable<any> {
        let basicOptions: RequestOptionsArgs = {
            url: url,
            method: RequestMethod.Delete,
            search: null,
            headers: new Headers(),
            body: null
        };
        let reqOptions = new RequestOptions(basicOptions);
        let req = new Request(reqOptions);

        return Observable.create((observer: Observer<any>) => {
            this.request(req, reqOptions).subscribe((res: Response) => {
                observer.next(null);
                observer.complete();
            }, error => {
                if (error.status == 500 && error.statusText == 'OK') {
                    try {
                        console.warn('[AuthHttp] UGLY CATCH OF 500 ERROR in http_delete!');
                        observer.next(null);
                        observer.complete();
                    } catch (e) {
                        observer.error(error);
                    }
                } else {
                    observer.error(error);
                }
            });
        });
    }

}
