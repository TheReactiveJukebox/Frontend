import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {MdIconRegistry, MdTabGroup} from '@angular/material';
import {TrackService} from '../../services/track.service';
import {Track} from '../../models/track';
import {PlayerService} from '../../services/player.service';
import {DomSanitizer} from '@angular/platform-browser';

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
                public trackService: TrackService,
                private mdIconRegistry: MdIconRegistry,
                private sanitizer: DomSanitizer) {
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
        this.mdIconRegistry.addSvgIconInNamespace('img', 'sprites',
            this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/sprites.svg'));
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
