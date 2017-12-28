import {Component, Injectable} from '@angular/core';
import { AuthHttp } from './auth/auth-http';
import {Headers, Http} from '@angular/http';
import {Config} from '../config';
import {AuthService} from './auth/auth.service';

@Injectable()
export class LoggingService {

    private backendLogAmount: number;

    private loggingApiUrl: string = Config.serverUrl + '/api/logging';

    constructor(private authHttp: AuthHttp,
                private authService: AuthService,
                private http: Http) {
        this.backendLogAmount = 0;
    }

    public log(component: any, message: string, object?: any): void {
        let prefix: string = '[' + component.constructor.name + '] ';
        message = prefix + message;
        if (object) {
            console.log(message, object);
        } else {
            console.log(message);
        }
    }

    public warn(component: Component, message: string, object?: any): void {
        let prefix: string = '[' + component.constructor.name + '] ';
        message = prefix + message;
        if (object) {
            console.warn(message, object);
            this.screamForHelp(message, object);
        } else {
            console.warn(message);
            this.screamForHelp(message);
        }
    }

    public error(component: Component, message: string, object?: any): void {
        let prefix: string = '[' + component.constructor.name + '] ';
        message = prefix + message;
        if (object) {
            console.error(message, object);
            if (this.backendLogAmount < Config.backendLogLimit) {
                this.backendLogAmount++;
                this.screamForHelp(message, object);
            }
        } else {
            console.error(message);
            if (this.backendLogAmount < Config.backendLogLimit) {
                this.backendLogAmount++;
                this.screamForHelp(message);
            }
        }
    }

    private screamForHelp(message: string, object?: any): void {
        if (!Config.dev) {
            const header = new Headers();
            header.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            let text = message + '\n';
            if (object) {
                text += JSON.stringify(object, null, 2);
            }
            let slackPayload = {
                text: text
            };
            this.http.post(Config.slackUrl,
                'payload=' + JSON.stringify(slackPayload, null, 2), {
                    headers: header
                }).subscribe(() => {

            }, error => {
                console.error('[LoggingService] Cant scream for help at slack. A bad disaster must have happened!', error);
            });

            if (this.authService.isLoggedIn()) {
                let backendPayload = {
                    message: text
                };
                this.authHttp.post(this.loggingApiUrl, backendPayload).subscribe(() => {

                }, error => {
                    console.error('[LoggingService] Cant scream for help at backend. A bad disaster must have happened!', error);
                });
            }
        }
    }


}
