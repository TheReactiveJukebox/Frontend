import {Component, OnInit, ViewChild} from '@angular/core';
import {MdTabGroup} from '@angular/material';
import {Track} from '../../models/track';
import {AuthService} from '../../services/auth/auth.service';
import {PlayerService} from '../../services/player.service';
import {TrackService} from '../../services/track.service';

@Component({
    selector: 'player',
    styleUrls: ['./player.component.scss'],
    templateUrl: './player.component.html',
    providers: [PlayerService]
})
export class PlayerComponent implements OnInit {

    @ViewChild('tabs')
    tabs: MdTabGroup;

    public showPlayerBar: boolean = false;

    constructor(public authService: AuthService,
                public trackService: TrackService) {
        this.trackService.currentTrack.subscribe((track: Track) => {
            if (track) {
                this.showPlayerBar = true;
            } else {
                this.showPlayerBar = false;
            }
        });
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

    public getOffsetHeight(): number {
        if (this.showPlayerBar) {
            return 44;
        } else {
            return 0;
        }
    }
}
