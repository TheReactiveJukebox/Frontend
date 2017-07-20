import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Track} from '../../../models/track';
import {FeedbackService} from '../../../services/feedback.service';
import {TrackFeedback} from '../../../models/trackFeedback';

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


    @Output()
    onDelete: EventEmitter<any>;

    constructor(public feedbackService: FeedbackService) {
        this.onDelete = new EventEmitter<any>();
    }

    btn_like() {
        let tmpFeedback = this.feedbackService.createTrackFeedbackToTrack(this.track);
        tmpFeedback.songLiked=true;
        this.feedbackService.postTrackFeedback(tmpFeedback);
    }

    btn_dislike() {
        let tmpFeedback = this.feedbackService.createTrackFeedbackToTrack(this.track);
        tmpFeedback.songDisliked=true;
        this.feedbackService.postTrackFeedback(tmpFeedback);
    }

}
