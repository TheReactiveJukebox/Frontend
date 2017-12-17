import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {LoggingService} from './logging.service';
@Injectable()

export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) {

    }

    public handleError(error): void {
        const loggingService = this.injector.get(LoggingService);
        loggingService.error(this, 'UNHANDLED ERROR', error);
    }

}
