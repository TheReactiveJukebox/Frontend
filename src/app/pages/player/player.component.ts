import {Component, OnInit} from '@angular/core';
import {TrackService} from '../../services/track.service';
import {AppComponent} from '../../app.component';
import {AuthService} from '../../services/auth/auth.service';

@Component({
    selector: 'player',
    styleUrls: [ './player.component.scss' ],
    templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {

    constructor(public trackService: TrackService, public authService: AuthService) {}


    ngOnInit(): void {
        this.trackService.refreshTracks();
    }

    logout(): void {

        //TODO: trigger loading of login page
    }

}
