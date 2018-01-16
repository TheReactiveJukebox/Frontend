import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {LoggingService} from '../services/logging.service';
import {HistoryService} from '../services/history.service';
import {TrackService} from '../services/track.service';
import {RadiostationService} from '../services/radiostation.service';
import {FeedbackService} from '../services/feedback.service';
import {LoadingService} from '../services/loading.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService,
                private radiostationService: RadiostationService,
                private feedbackService: FeedbackService,
                private loggingService: LoggingService,
                private loadingService: LoadingService,
                private historyService: HistoryService,
                private trackService: TrackService,
                private router: Router) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // user is logged in and has rights to access
        if (this.authService.isLoggedIn()) {
            return true;
        } else { // user isn't logged in and has no rights to access. redirect to login page
            this.loadingService.show();
            this.loggingService.log(this, 'Performing autologin!');
            this.authService.performAutoLogin().subscribe(() => {
                this.radiostationService.init();
                this.trackService.init();
                this.historyService.clearLocalHistory();
                this.feedbackService.init();
                this.loadingService.hide();
                this.router.navigate([state.url]);
            }, err => {
                this.loadingService.hide();
                this.loggingService.log(this, 'Autologin failed!', err);
                this.router.navigate(['/login']);
            });
            return false;
        }
    }
}
