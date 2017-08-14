import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Track} from '../../../models/track';
import {FeedbackService} from '../../../services/feedback.service';

@Component({
    selector: 'track-list-item',
    templateUrl: './track-list-item.component.html',
    styleUrls: ['./track-list-item.component.scss']
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

    constructor(public feedbackService: FeedbackService) {
        this.onDelete = new EventEmitter<any>();
    }

    btn_like() {
        this.feedbackService.postSimpleFeedback(this.track, true);
    }

    btn_dislike() {
        this.feedbackService.postSimpleFeedback(this.track, false);
    }

}
