import { Component, HostListener, ViewChild } from '@angular/core';
import { MdTabGroup } from '@angular/material';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth/auth.service';
import {Config} from '../../config';

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

    @ViewChild('tabGroup') private tabGroup: MdTabGroup;

    public loginData: {username?: string, password?: string} = {};
    public registerData: {username?: string, password?: string, inviteKey?: string} = {};

    public study: boolean = Config.study;

    constructor(private authService: AuthService,
                private translateService: TranslateService,
                private router: Router) {}

    public login(): void {
        this.authService.login(this.loginData).subscribe(() => {
            this.router.navigate(['/player']);
        }, (error: Response) => {
            if (error.status == 442) {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.WRONG_PW_OR_USER'));
            } else {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.GENERAL_LOGIN'));
            }
        });
    }

    public register(): void {
        this.authService.registerUser(this.registerData).subscribe(data => {
            this.router.navigate(['/player']);
        }, (error: Response) => {
            if (error.status == 440) {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.USERNAME_IN_USE'));
            } else if (error.status == 441) {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.WRONG_KEY'));
            } else {
                alert(this.translateService.instant('LOGIN_PAGE.ERROR.GENERAL_REGISTER'));
            }
            console.log('Register failed: ', error);
        });
    }

}
