import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MdTabGroup } from '@angular/material';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth/auth.service';

@Component({
    selector: 'about',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit, OnDestroy {

    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            if (this.tabGroup.selectedIndex == 0) {
                this.login();
            } else {
                this.register();
            }
        }
    }

    @ViewChild('tabGroup') tabGroup: MdTabGroup;

    loginData: {username?: string, password?: string} = {};
    registerData: {username?: string, password?: string, inviteKey?: string} = {};

    constructor(private authService: AuthService,
                private translateService: TranslateService,
                private router: Router) {}

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
    }

    login(): void {
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

    register(): void {
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
