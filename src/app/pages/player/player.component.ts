import { Component, OnInit } from '@angular/core';
import { AppState } from '../../services/app.service';
import { AuthHttp } from '../../services/auth/auth-http';
import { Config } from '../../config';
import { TrackService } from '../../services/track.service';

@Component({
    selector: 'player',
    styleUrls: [ './player.component.css' ],
    templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {

    message: any;

    constructor(public trackService: TrackService,
				private authHttp: AuthHttp) {}

    ngOnInit(): void {
        this.trackService.refreshTracks();
    }

    public test(): void {
        this.authHttp.get(Config.serverUrl + '/api/hello/test/Hi').subscribe((data) => {
            this.message = data.message;
        });
    }

}
