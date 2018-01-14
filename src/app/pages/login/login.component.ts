import { Component, HostListener, ViewChild } from '@angular/core';
import { MdTabGroup } from '@angular/material';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth/auth.service';
import {RadiostationService} from '../../services/radiostation.service';
import {TrackService} from '../../services/track.service';
import {HistoryService} from '../../services/history.service';
import {FeedbackService} from '../../services/feedback.service';
import {LoggingService} from '../../services/logging.service';
import {LoadingService} from '../../services/loading.service';

declare var safari;
declare var window;
declare var document;

@Component({
    selector: 'about',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {

    @HostListener('window:keydown', ['$event'])
    public keyboardInput(event: KeyboardEvent): void {
        if (event.key == 'Enter') {
            if (this.tabGroup.selectedIndex == 0) {
                this.login();
            } else {
                this.register();
            }
        }
    }

    public isNiceBrowser: boolean = true;

    @ViewChild('tabGroup') private tabGroup: MdTabGroup;

    public loginData: {username?: string, password?: string} = {};
    public registerData: {username?: string, password?: string, inviteKey?: string} = {};

    constructor(private authService: AuthService,
                private translateService: TranslateService,
                private radiostationService: RadiostationService,
                private feedbackService: FeedbackService,
                private loggingService: LoggingService,
                private historyService: HistoryService,
                private trackService: TrackService,
                private loadingService: LoadingService,
                private router: Router) {
        this.isNiceBrowser = this.getBrowserInfo();
    }

    public login(): void {
        this.loadingService.show();
        this.authService.login(this.loginData).subscribe(() => {
            this.radiostationService.init();
            this.trackService.init();
            this.historyService.clearLocalHistory();
            this.feedbackService.init();
            this.loadingService.hide();
            this.router.navigate(['/player']);
        }, (error: Response) => {
            this.loadingService.hide();
            if (error.status == 442) {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.WRONG_PW_OR_USER'));
            } else {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.GENERAL_LOGIN'));
                this.loggingService.error(this, 'Login failed!', error);
            }
        });
    }

    public register(): void {
        this.loadingService.show();
        this.authService.registerUser(this.registerData).subscribe(data => {
            this.radiostationService.init();
            this.trackService.init();
            this.historyService.clearLocalHistory();
            this.feedbackService.init();
            this.loadingService.hide();
            this.router.navigate(['/player']);
        }, (error: Response) => {
            this.loadingService.hide();
            if (error.status == 440) {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.USERNAME_IN_USE'));
            } else if (error.status == 441) {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.WRONG_KEY'));
            } else {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.GENERAL_REGISTER'));
                this.loggingService.error(this, 'Register failed!', error);
            }
        });
    }

    private getBrowserInfo(): boolean {
        // Safari 3.0+ "[object HTMLElementConstructor]"
        let isSafari = /constructor/i.test(window.HTMLElement) ||
            (function (p: any): any { return p.toString() === '[object SafariRemoteNotification]'; })(!window['safari'] ||
                (typeof safari !== 'undefined' && safari.pushNotification));

        // Internet Explorer 6-11
        let isIE = /*@cc_on!@*/false || !!document.documentMode;

        // Edge 20+
        let isEdge = !isIE && !!window.StyleMedia;

        return !(isSafari || isIE || isEdge);
    }

}
