/**
 * This service takes care of the local history of the currently playing radio
 */
import {Injectable} from '@angular/core';
import {Track} from '../models/track';

@Injectable()
export class HistoryService {

    history: Track[] = [];
    visibleHistory: Track[] = [];
    historyVisible: boolean = false;
    visibilityLimit: number = 5;

    public writeToLocalHistory(track: Track): void {
        this.history.push(track);
        this.updateVisibleHistory();
    }

    public clearLocalHistory(): void {
        this.history = [];
        this.updateVisibleHistory()
    }

    private updateVisibleHistory(): void {
        this.visibleHistory = this.history.slice(this.visibilityLimit * -1);
    }
}
