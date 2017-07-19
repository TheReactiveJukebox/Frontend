import {Component} from '@angular/core';
import {HistoryService} from '../../services/history.service';

@Component({
    selector: 'history-list',
    templateUrl: './history-list.component.html',
    styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent {

    isExpanded: boolean = false;
    visibilityLimit: number = 5;

    constructor(public historyService: HistoryService) { }

    public toggleExpansion(): void {
        this.isExpanded = !this.isExpanded;
    }

    btn_like(track) {
        console.log('Like for track ' + track.title + ' has been triggered!');
    }

    btn_dislike(track) {
        console.log('Dislike for track ' + track.title + ' has been triggered!');
    }
}
