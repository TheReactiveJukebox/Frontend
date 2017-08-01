/**
 * This service takes care of the local history of the currently playing radio
 */
import {Injectable} from '@angular/core';
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';
import {Config} from '../config';
import {forEach} from '@angular/router/src/utils/collection';

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

    public calculateMeanSpeed(): number{
        if(this.history.length > 0){
            let sumSpeed: number;
            for (var i = 0; i < this.history.length; i++){
                sumSpeed = sumSpeed + this.history[i].speed;
            }
            return sumSpeed/i;
        }
        else {
            return 0;
        }

    }

    public calculateMeanDynamic(): number{
        if(this.history.length > 0) {
            let sumDynamic: number;
            for (var i = 0; i < this.history.length; i++) {
                sumDynamic = sumDynamic + this.history[i].dynamic;
            }
            return sumDynamic / i;
        }
        else {
            return 0;
        }
    }

    public calculateMeanYear(): number{
        if(this.history.length > 0) {
            let sumYear: number;
            for (var i = 0; i < this.history.length; i++) {
                sumYear = sumYear + this.history[i].period;
            }
            return sumYear / i;
        }
        else {
            return 0;
        }
    }
}
