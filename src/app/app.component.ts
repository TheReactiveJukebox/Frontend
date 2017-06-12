/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppState } from './services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

/**
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    private availableLangs: string[] = ['en', 'de'];

    constructor(public appState: AppState,
                private authService: AuthService,
                private router: Router,
                private translateService: TranslateService) {

        // set the default lang as fall-back and current device lang.
        this.translateService.setDefaultLang('en');

        console.debug('LANG: ' + this.translateService.getBrowserLang());
        // if browser's default lang is available for this app, use  the lang in translateService
        let contain: boolean = this.availableLangs.some((lang: string): boolean => {
            return this.translateService.getBrowserLang() === lang;
        });
        if (contain) {
            this.translateService.use(this.translateService.getBrowserLang());
        }

        // try to perform autologin and navigate to player, if it was successful
        this.authService.performAutoLogin().subscribe(() => {
            this.router.navigate(['/player']);
        },error => {
            console.log('Autologin failed: ', error);
        });
    }

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);
    }

    public tintBackground(color: string) {
        document.body.style.backgroundColor = color;
    }

}