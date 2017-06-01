import { Component, OnInit } from '@angular/core';
import { Track } from '../../models/track';
import { TrackService } from '../../services/track.service';

@Component({
    selector: 'track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.css']
})
export class TrackListComponent implements OnInit {
    tracks: Track[];
    
    constructor(private trackService: TrackService) {}
    
    ngOnInit(): void {
        this.getTracks();
    }
    
    getTracks(): void {
        this.trackService.getTracks().then(tracks => this.tracks = tracks);
    }
}
