import {Component} from '@angular/core';
import {HistoryService} from '../../services/history.service';

@Component({
    selector: 'history-list',
    templateUrl: './history-list.component.html',
    styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent {

    constructor(public historyService: HistoryService) {
    }

}
