/**
 * This service takes care of the local history of the currently playing radio
 */
import {Injectable} from '@angular/core';
import {Config} from '../config';
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';
import {TendencyFeedbackDialogComponent} from '../components/dialogs/tendency-feedback/tendency-feedback-dialog.component';

@Injectable()
export class HistoryService {

    history: Track[] = [];
    historyVisible: boolean = false;

    private historyDeleteUrl = Config.serverUrl + '/api/history';

    constructor(private authHttp: AuthHttp) {
    }

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
                this.history.splice(i, 1);
            }
        }
        // Then remove item from database
        this.authHttp.http_delete(this.historyDeleteUrl + '?id=' + historyId).subscribe(() =>
            console.log('Delete was successful')
        );
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
            return 0;
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
            let curYear = this.getReleaseYear(this.history[i]);
            if (curYear != null) {
                if (curYear > max) {
                    max = curYear;
                }
            }
        }
        if (max == Number.NEGATIVE_INFINITY) {
            return new Date().getFullYear();
        }
        return max;
    }


    public getMinYear(): number {
        let min = Number.POSITIVE_INFINITY;
        for (let i = 1; i < this.history.length; i++) {
            let curYear = this.getReleaseYear(this.history[i]);
            if (curYear != null) {
                if (curYear < min) {
                    min = curYear;
                }
            }
        }
        if (min == Number.POSITIVE_INFINITY) {
            return 1800
        }
        return min;
    }

    public getReleaseYear(track: Track): number {
        if (track.releaseDate == null) {
            return null;
        } else {
            let currentReleaseDate: Date = new Date(track.releaseDate);
            return currentReleaseDate.getFullYear();
        }

    }
}
