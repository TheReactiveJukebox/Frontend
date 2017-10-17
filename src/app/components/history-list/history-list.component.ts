import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component} from '@angular/core';
import {Track} from '../../models/track';
import {HistoryService} from '../../services/history.service';
import {IndirectFeedbackService} from '../../services/indirect-feedback.service';
import {RadiostationService} from '../../services/radiostation.service';

@Component({
    selector: 'history-list',
    templateUrl: './history-list.component.html',
    styleUrls: ['./history-list.component.scss'],
    animations: [
        trigger('fadeIn', [
            state('true', style({'height': '*'})),
            state('void', style({'height': '0px'})),
            transition('void => *', animate('1.0s ease-out')),
            transition('* => void', animate('1.0s ease-out'))
        ])
    ]
})
export class HistoryListComponent {

    isExpanded: boolean = false;
    visibilityLimit: number = 5;

    constructor(public historyService: HistoryService,
                private indirectFeedbackService: IndirectFeedbackService,
                private radioStationService: RadiostationService) { }

    public toggleExpansion(): void {
        this.isExpanded = !this.isExpanded;
    }

    public indirectFeedback(track: Track): void {
        //Sends delete Feedback with duration as position to indicate deletion out of history
        this.indirectFeedbackService.sendDeleteFeedback(track.id, this.radioStationService.getJukebox().id, track.duration);
    }
}
