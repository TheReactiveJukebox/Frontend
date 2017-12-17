/**
 * This service takes care of the local history of the currently playing radio
 */
import {Injectable} from '@angular/core';
import {Config} from 'app/config';
import {Radiostation} from '../models/radiostation';
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';
import {RadiostationService} from './radiostation.service';
import {LoggingService} from './logging.service';

@Injectable()
export class HistoryService {

    public history: Track[] = [];
    public historyVisible: boolean = false;
    private currentRadiostationId: number = -1;

    private historyApiUrl: string = Config.serverUrl + '/api/history';

    constructor(private authHttp: AuthHttp,
                private loggingService: LoggingService,
                private radiostationService: RadiostationService) {
        this.radiostationService.getRadiostationSubject().subscribe((radiostation: Radiostation) => {
            if (radiostation != null) {
                // when radiostationId changes, we have to reset the history. On radiostation update we will get a new
                // object but the id will be the same
                if (this.currentRadiostationId != radiostation.id) {
                    this.clearLocalHistory();
                }
                this.currentRadiostationId = radiostation.id;
            }
        });
    }

    public clearLocalHistory(): void {
        this.history = [];
    }

    public deleteFromPersistentHistory(historyId: number): void {
        // First remove item from the local history
        let i: number;
        for (i = 0; i < this.history.length; i++) {
            if (this.history[i].historyId == historyId) {
                this.history.splice(i, 1);
            }
        }
        // Then remove item from database
        this.authHttp.http_delete(this.historyApiUrl + '?id=' + historyId).subscribe(() => {
            this.loggingService.log(this, 'Delete from history was successful!');
        }, error => {
            this.loggingService.error(this, 'Delete from history failed!', error);
        });
    }

    //saves the song to the history by sending its id to the corresponding api endpoint
    public writeToHistory(track: Track): void {
        if (this.history.length > 0 && this.history.slice(-1)[0].id == track.id) {
            return;
        }
        this.history.push(track);
        let reqBody = {
            trackId: track.id,
            radioId: this.currentRadiostationId
        };

        this.authHttp.post(this.historyApiUrl, reqBody).subscribe((data: any) => {
            track.historyId = data.id;
        }, (error: any) => {
            if (error.status == 500 && error.statusText == 'OK') {
                this.loggingService.warn(this, 'UGLY CATCH OF 500 Error in writeToHistory!');
                track.historyId = error._body;
            } else {
                this.loggingService.error(this, 'Writing "' + track.title + '" to history failed!', error);
            }
        });

    }

}
