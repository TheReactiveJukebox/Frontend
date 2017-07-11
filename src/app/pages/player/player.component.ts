import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {MdTabGroup} from '@angular/material';
import {TrackService} from '../../services/track.service';

@Component({
    selector: 'player',
    styleUrls: ['./player.component.scss'],
    templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit{

    @ViewChild('tabs')
    tabs: MdTabGroup;

    constructor(public authService: AuthService,
                private trackService: TrackService) {

    }

    ngOnInit(): void {
        if (this.trackService.hasNextTracks()) {
            this.tabs.selectedIndex = 2;
        } else {
            this.tabs.selectedIndex = 0;
        }
    }

    public switchToPlayer(): void {
        this.tabs.selectedIndex = 2;
    }
}
