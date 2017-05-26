/**
 * Angular 2 decorators and services
 */
import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { AppState } from './services/app.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    public angularclassLogo = 'assets/img/angularclass-avatar.png';
    public name = 'Angular 2 Webpack Starter';
    public url = 'https://twitter.com/AngularClass';

    private availableLangs: string[] = ['en', 'de'];

    constructor(public appState: AppState,
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
    }

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);
    }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
