import {Injectable} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Config} from '../config';
import {MdDialog} from '@angular/material';
import {OpenSurveyComponent} from '../components/dialogs/open-survey/open-survey.component';

@Injectable()
export class SurveyService {

    private surveyUrl: string = 'https://docs.google.com/forms/d/e/1FAIpQLSeFrq80WF_HWSxvQaaF8xvtk9YZt5_DpZ5yMxb8-EalK_YTrQ/viewform?' +
        'usp=pp_url&entry.478674814=';

    // TODO: define a final rule for 'finished users'
    private songTarget: number = 15;
    private playedSongs: number = 0;
    private popupOpened: boolean = false;

    constructor(private authService: AuthService,
                private dialog: MdDialog) {
    }

    public openSurvey(): void {
        window.open(this.surveyUrl + this.authService.getUsername());
    }

    public canOpenSurvey(): boolean {
        return this.playedSongs >= this.songTarget;
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
            dialogRef.afterClosed().subscribe(result => {
                if (result && result == 'survey') {
                    this.openSurvey();
                }
            });
        }
    }

}
