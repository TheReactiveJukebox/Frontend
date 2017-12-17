import {Component, Injectable} from '@angular/core';
import { AuthHttp } from './auth/auth-http';

@Injectable()
export class LoggingService {

    constructor(private authHttp: AuthHttp) { }

    public log(component: any, message: string, object?: any): void {
        let prefix: string = '[' + component.constructor.name + '] ';
        if (object) {
            console.log(prefix + message, object);
        } else {
            console.log(prefix + message);
        }
    }

    public warn(component: Component, message: string, object?: any): void {
        let prefix: string = '[' + component.constructor.name + '] ';
        if (object) {
            console.warn(prefix + message, object);
        } else {
            console.warn(prefix + message);
        }
    }

    public error(component: Component, message: string, object?: any): void {
        let prefix: string = '[' + component.constructor.name + '] ';
        if (object) {
            console.error(prefix + message, object);
        } else {
            console.error(prefix + message);
        }
    }

}
