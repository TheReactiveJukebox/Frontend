import {Component, OnInit} from '@angular/core';
import {TrackService} from '../../services/track.service';
import {AppComponent} from '../../app.component';

@Component({
    selector: 'player',
    styleUrls: ['./player.component.scss'],
    templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {

    constructor(public trackService: TrackService, public parent: AppComponent) {
    }


    ngOnInit(): void {
        this.parent.tintBackground('#424242');
    }

}
