import { Component } from '@angular/core';
import { TrackService } from '../../services/track.service';

@Component({
    selector: 'track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.css']
})
export class TrackListComponent {
    constructor(public trackService: TrackService) {}
}
