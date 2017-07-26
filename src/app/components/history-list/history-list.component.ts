import {Component} from '@angular/core';
import {HistoryService} from '../../services/history.service';
import {Track} from '../../models/track';
import {IndirectFeedbackService} from '../../services/indirect-feedback.service';
import {RadiostationService} from '../../services/radiostation.service';

@Component({
    selector: 'history-list',
    templateUrl: './history-list.component.html',
    styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent {

    isExpanded: boolean = false;
    visibilityLimit: number = 5;

    constructor(public historyService: HistoryService,
                private  indirectFeedbackService: IndirectFeedbackService,
                private radioStationService: RadiostationService) { }

    public toggleExpansion(): void {
        this.isExpanded = !this.isExpanded;
    }

    public indirectFeedback(track:Track): void{
        this.indirectFeedbackService.sendDeleteFeedback(track.id,this.radioStationService.jukebox.id,track.duration);
    }
}
