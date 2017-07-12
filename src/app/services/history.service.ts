/**
 * This service takes care of the local history of the currently playing radio
 */
import {Injectable} from '@angular/core';
import {Track} from '../models/track';

@Injectable()
export class HistoryService {

    history: Track[] = [];
    historyVisible: boolean = false;

    public writeToLocalHistory(track: Track): void {
        this.history.push(track);
    }

    public clearLocalHistory(): void {
        this.history = [];
    }
}
