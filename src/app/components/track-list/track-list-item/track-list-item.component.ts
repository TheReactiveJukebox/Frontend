import {Component, Input} from '@angular/core';
import {Track} from '../../../models/track';

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

    constructor() {

    }

    btn_like() {
        console.log('Like for track ' + this.track.title + ' has been triggered!');
    }

    btn_dislike() {
        console.log('Dislike for track ' + this.track.title + ' has been triggered!');
    }

}
