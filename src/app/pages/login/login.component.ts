import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppComponent} from '../../app.component';
import {AuthService} from '../../services/auth/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'about',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {

    loginData: {username?: string, password?: string} = {};
    registerData: {username?: string, password?: string, inviteKey?: string} = {};

    constructor(public parent: AppComponent,
                private authService: AuthService,
                private translateService: TranslateService,
                private router: Router) {}

    public ngOnInit() {
        this.parent.tintBackground('#4CAF50');
    }

    login(): void {
        console.log('Login pressed!');
        this.authService.login(this.loginData).subscribe(() => {
            this.parent.tintBackground('#FFFFFF');
            this.router.navigate(['/player']);
        }, (error: Response) => {
            if(error.status == 442) {
                console.log('Login failed!');
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.WRONG_PW_OR_USER'));
            }
        });
    }

    register(): void {
        this.authService.registerUser(this.registerData).subscribe(data => {
            this.parent.tintBackground('#FFFFFF');
            this.router.navigate(['/player']);
        }, (error: Response) => {
            if (error.status == 440) {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.USERNAME_IN_USE'));
            } else if (error.status == 441) {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.WRONG_KEY'));
            } else {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.GENERAL'));
            }
            console.log('Register failed!', error);
        });
    }

}
