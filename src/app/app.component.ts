/**
 * Angular 2 decorators and services
 */
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { OverlayContainer } from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {AppState} from './services/app.service';
import {AuthService} from './services/auth/auth.service';

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
    // use this to set correct theme class on app holder
    // eg: <div [class]="themeClass">...</div>
    themeClass: string;

    constructor(private authService: AuthService,
                private translateService: TranslateService,
                private overlayContainer: OverlayContainer) {

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
            console.log('Autologin Success!');
        }, error => {
            console.log('Autologin failed: ', error);
        });
    }

    public ngOnInit() {
        // subscribe to some source of theme change events, then...
        this.themeClass = 'default-theme';
        this.overlayContainer.themeClass = 'default-theme';
    }

}
