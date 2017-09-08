import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Track} from '../../../models/track';
import {FeedbackService} from '../../../services/feedback.service';

@Component({
    selector: 'track-list-item',
    templateUrl: './track-list-item.component.html',
    styleUrls: ['./track-list-item.component.scss'],
    animations: [
        trigger('expand', [
            state('true', style({'height': '*'})),
            state('void', style({'height': '0px'})),
            transition('void => *', animate('0.5s ease-out')),
            transition('* => void', animate('0.5s ease-out'))
        ])
    ]
})
export class TrackListItemComponent {

    @Input()
    track: Track;

    @Input()
    showFeedback: boolean = true;

    @Input()
    showDelete: boolean = true;

    @Output()
    onDelete: EventEmitter<any>;

    public showItem: boolean;

    constructor(public feedbackService: FeedbackService) {
        this.onDelete = new EventEmitter<any>();
        this.showItem = true;
    }

    btn_like() {
        this.feedbackService.postSimpleFeedback(this.track, true);
    }

    btn_dislike() {
        this.feedbackService.postSimpleFeedback(this.track, false);
    }

    public round(value: number): number {
        return Math.round(value);
    }

    public hideItem(): void {
        this.showItem = false;
    }

}
