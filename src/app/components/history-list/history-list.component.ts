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

}
