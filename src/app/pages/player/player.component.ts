import {Component, OnInit, ViewChild} from '@angular/core';
import {MdIconRegistry, MdTabGroup} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Track} from '../../models/track';
import {AuthService} from '../../services/auth/auth.service';
import {TrackService} from '../../services/track.service';
import {RadiostationService} from '../../services/radiostation.service';
import {Radiostation} from '../../models/radiostation';
import {Config} from '../../config';
import {SurveyService} from '../../services/survey.service';


@Component({
    selector: 'player',
    styleUrls: ['./player.component.scss'],
    templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {

    @ViewChild('tabs')
    private tabs: MdTabGroup;

    public showPlayerBar: boolean = false;

    public study: boolean = Config.study;

    constructor(public authService: AuthService,
                public trackService: TrackService,
                public radiostationService: RadiostationService,
                private mdIconRegistry: MdIconRegistry,
                public surveyService: SurveyService,
                private sanitizer: DomSanitizer) {
        this.trackService.currentTrack.subscribe((track: Track) => {
            if (track) {
                this.showPlayerBar = true;
            } else {
                this.showPlayerBar = false;
            }
        });
        this.radiostationService.getRadiostationSubject().subscribe((radio: Radiostation) => {
            if (radio != null && !this.study) {
                this.switchToPlayer();
            }
        });

    }

    public ngOnInit(): void {
        if (this.study) {
            this.tabs.selectedIndex = 2;
        }

        this.mdIconRegistry.addSvgIconInNamespace('img', 'sprites',
            this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/sprites.svg'));
    }

    public switchToPlayer(): void {
        if (this.tabs) {
            this.tabs.selectedIndex = 1;
        }
    }

    public switchToCreate(): void {
        this.tabs.selectedIndex = 0;
    }

    public getOffsetHeight(): number {
        if (this.showPlayerBar) {
            return 44;
        } else {
            return 0;
        }
    }
}
