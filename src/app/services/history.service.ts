/**
 * This service takes care of the local history of the currently playing radio
 */
import {Injectable} from '@angular/core';
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';
import {Config} from '../config';

@Injectable()
export class HistoryService {

    history: Track[] = [];
    historyVisible: boolean = false;

    private historyDeleteUrl = Config.serverUrl + '/api/history';

    constructor(private authHttp: AuthHttp) { }

    public writeToLocalHistory(track: Track): void {
        this.history.push(track);
    }

    public clearLocalHistory(): void {
        this.history = [];
    }

    public deleteFromPersistentHistory(historyId): void {
        // First remove item from the local history
        let i: number;
        for (i = 0; i < this.history.length; i++) {
            if (this.history[i].historyId == historyId) {
                this.history.splice(i,1);
            }
        }
        // Then remove item from database
        this.authHttp.http_delete(this.historyDeleteUrl + '?id=' + historyId).subscribe(() =>
            console.log('Delete was successful')
        );
    }
}
