/**
 * This service takes care of the local history of the currently playing radio
 */
import {Injectable} from '@angular/core';
import {Config} from 'app/config';
import {Radiostation} from '../models/radiostation';
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';
import {RadiostationService} from './radiostation.service';

@Injectable()
export class HistoryService {

    public history: Track[] = [];
    public historyVisible: boolean = false;
    private currentRadiostationId: number = -1;

    private historyApiUrl: string = Config.serverUrl + '/api/history';

    constructor(private authHttp: AuthHttp,
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
            console.log('Delete from history was successful');
        }, error => {
            console.log('Delete from history failed: ', error);
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
                console.warn('WARNING: UGLY CATCH OF 500 Error in writeToHistory!!!');
                console.log('HISTORY RETURN DATA: ', JSON.parse(error._body));
                track.historyId = JSON.parse(error._body).id;
            } else {
                console.log('Writing "' + track.title + '" to history failed!', error);
            }
        });

    }

    public getMeanSpeed(): number {
        if (this.history.length > 0) {
            let sumSpeed: number;
            sumSpeed = 0;
            for (let i = 0; i < this.history.length; i++) {
                sumSpeed = sumSpeed + this.history[i].speed;
            }
            return sumSpeed / this.history.length;
        } else {
            return Config.speedLowerLimit;
        }
    }

    public getMeanDynamic(): number {
        if (this.history.length > 0) {
            let sumDynamic: number;
            sumDynamic = 0;
            for (let i = 0; i < this.history.length; i++) {
                sumDynamic = sumDynamic + this.history[i].dynamic;
            }
            return sumDynamic / this.history.length;
        } else {
            return 0;
        }
    }

    public getMaxYear(): number {
        let max = Number.NEGATIVE_INFINITY;
        for (let i = 1; i < this.history.length; i++) {
            if (this.history[i].releaseDate) {
                let curYear = this.history[i].releaseDate.getFullYear();
                if (curYear > max) {
                    max = curYear;
                }
            }
        }
        if (max == Number.NEGATIVE_INFINITY) {
            return Config.yearUpperLimit;
        }
        return max;
    }


    public getMinYear(): number {
        let min = Number.POSITIVE_INFINITY;
        for (let i = 1; i < this.history.length; i++) {
            if (this.history[i].releaseDate) {
                let curYear = this.history[i].releaseDate.getFullYear();
                if (curYear < min) {
                    min = curYear;
                }
            }
        }
        if (min == Number.POSITIVE_INFINITY) {
            return Config.yearLowerLimit;
        }
        return min;
    }

}
