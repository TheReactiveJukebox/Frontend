/**
 * Angular 2 decorators and services
 */
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {OverlayContainer} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './services/auth/auth.service';
import {LoggingService} from './services/logging.service';
import {Config} from './config';

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
    public themeClass: string;

    constructor(private authService: AuthService,
                private translateService: TranslateService,
                private loggingService: LoggingService,
                private overlayContainer: OverlayContainer) {

        if (Config.study) {
            this.translateService.setDefaultLang('de');
        } else {
            // set the default lang as fall-back and current device lang.
            this.translateService.setDefaultLang('en');

            this.loggingService.log(this, 'LANG: ' + this.translateService.getBrowserLang());
            // if browser's default lang is available for this app, use  the lang in translateService
            let contain: boolean = this.availableLangs.some((lang: string): boolean => {
                return this.translateService.getBrowserLang() === lang;
            });
            if (contain) {
                this.translateService.use(this.translateService.getBrowserLang());
            }
        }

        // try to perform autologin and navigate to player, if it was successful
        this.authService.performAutoLogin().subscribe(() => {
            this.loggingService.log(this, 'Autologin Success!');
        }, error => {
            this.loggingService.log(this, 'Autologin failed!', error);
        });
    }

    public ngOnInit(): void {
        // subscribe to some source of theme change events, then...
        this.themeClass = 'default-theme';
        this.overlayContainer.getContainerElement().classList.add('default-theme');
    }

}
