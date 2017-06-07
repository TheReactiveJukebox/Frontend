import { Component, OnInit } from '@angular/core';
import { AppState } from '../../services/app.service';
import { TrackService } from '../../services/track.service';

@Component({
    selector: 'player',
    styleUrls: [ './player.component.css' ],
    templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {
    constructor(public trackService: TrackService) {}

    ngOnInit(): void {
        this.trackService.refreshTracks();
    }
}
