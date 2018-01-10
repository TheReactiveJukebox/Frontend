import {Injectable} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Config} from '../config';
import {MdDialog} from '@angular/material';
import {OpenSurveyComponent} from '../components/dialogs/open-survey/open-survey.component';
import {TrackService} from './track.service';
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';

@Injectable()
export class SurveyService {

    private surveyUrl: string = 'https://docs.google.com/forms/d/e/1FAIpQLSeFrq80WF_HWSxvQaaF8xvtk9YZt5_DpZ5yMxb8-EalK_YTrQ/viewform?' +
        'usp=pp_url&entry.478674814=';

    private studyApiUrl: string = Config.serverUrl + '/api/study';

    private playedSongsTarget: number = 20;
    private startedSongsTarget: number = 30;
    private playedSongs: number = 0;
    private startedSongs: number = 0;
    private popupOpened: boolean = false;

    constructor(private authService: AuthService,
                private authHttp: AuthHttp,
                private trackService: TrackService,
                private dialog: MdDialog) {
        this.trackService.currentTrack.asObservable().subscribe((track: Track) => {
            if (track != null) {
                this.startedSongs++;
                if (this.startedSongs >= this.startedSongsTarget) {
                    this.showPopup();
                }
            }
        });
    }

    public openSurvey(): void {
        this.authHttp.get(this.studyApiUrl).subscribe(() => {
           console.log('Successfully notified backend about redirection to survey!');
        }, error => {
            console.error('Failed to call api/study: ', error);
        });
        window.open(this.surveyUrl + this.authService.getUsername());
    }

    public canOpenSurvey(): boolean {
        return this.playedSongs >= this.playedSongsTarget || this.startedSongs >= this.startedSongsTarget;
    }

    public countUp(): void {
        if (Config.study) {
            this.playedSongs ++;
            if (this.canOpenSurvey()) {
                this.showPopup();
            }
        }
    }

    private showPopup(): void {
        if (!this.popupOpened) {
            this.popupOpened = true;
            let dialogRef = this.dialog.open(OpenSurveyComponent);
        }
    }

}
