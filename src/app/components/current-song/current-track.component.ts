import { Component, OnInit } from '@angular/core';
import { TrackService } from '../../services/track.service';

@Component({
    selector: 'current-track',
    templateUrl: './current-track.component.html',
    styleUrls: ['./current-track.component.css']
})
export class CurrentTrackComponent implements OnInit {
    constructor(public trackService: TrackService) {}

    ngOnInit(): void {
        this.trackService.refreshTracks();
    }
}
