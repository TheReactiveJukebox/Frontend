import {Component} from '@angular/core';
import {AuthHttp} from '../../../services/auth/auth-http';
import {AuthService} from '../../../services/auth/auth.service';
import {Config} from '../../../config';
import {LoggingService} from '../../../services/logging.service';

@Component({
    selector: 'open-survey',
    templateUrl: 'open-survey.component.html',
})

export class OpenSurveyComponent {

    private surveyUrl: string = 'https://docs.google.com/forms/d/e/1FAIpQLSeFrq80WF_HWSxvQaaF8xvtk9YZt5_DpZ5yMxb8-EalK_YTrQ/viewform?' +
        'usp=pp_url&entry.478674814=';

    private studyApiUrl: string = Config.serverUrl + '/api/study';

    constructor(private authHttp: AuthHttp,
                private authService: AuthService,
                private loggingService: LoggingService) {

    }

    public openSurvey(): void {
        this.authHttp.get(this.studyApiUrl).subscribe(() => {
            this.loggingService.log(this, 'Successfully notified backend about redirection to survey!');
        }, error => {
            this.loggingService.error(this, 'Failed to call api/study: ', error);
        });
        window.open(this.surveyUrl + this.authService.getUsername());
    }
}
