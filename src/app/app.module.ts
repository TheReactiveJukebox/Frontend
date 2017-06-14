import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import {
    NgModule,
} from '@angular/core';
import {
    RouterModule,
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import '../styles/styles.scss';
import 'hammerjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCheckboxModule, MdListModule } from '@angular/material';
import { LoginComponent } from './pages/login/login.component';
import { PlayerComponent } from './pages/player/player.component';
import { MdInputModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { MdTabsModule } from '@angular/material';
import { CookieModule, CookieService } from 'ngx-cookie';
import { AuthService } from './services/auth/auth.service';
import { AuthHttp } from './services/auth/auth-http';
import { TrackListComponent } from './components/track-list/track-list.component';
import { TrackService } from './services/track.service';
import { SecondsToDatePipe } from './pipes/seconds-to-date.pipe';
import { CurrentTrackComponent } from './components/current-track/current-track.component';
import { AuthGuard } from './guards/AuthGuard';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        LoginComponent,
        PlayerComponent,
        TrackListComponent,
        CurrentTrackComponent,
        SecondsToDatePipe
    ],
    /**
     * Import Angular's modules.
     */
    imports: [
        BrowserModule,
        CookieModule.forRoot(),
        FormsModule,
        HttpModule,
        BrowserAnimationsModule,
        MdButtonModule, MdCheckboxModule, MdInputModule, MdCardModule, MdTabsModule, MdListModule,
        RouterModule.forRoot(ROUTES),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        })
    ],
    entryComponents: [
        // maybe used later. when angular requests to declare a component here, just do it.
    ],
    /**
     * Expose our Services and Providers into Angular's dependency injection.
     */
    providers: [
        ENV_PROVIDERS,
        CookieService,
        AuthService,
        AuthHttp,
        AuthGuard,
        TrackService
    ]
})
export class AppModule {

}

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
