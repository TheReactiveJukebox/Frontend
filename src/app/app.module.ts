import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';
import {ROUTES} from './app.routes';
// App is our top level component
import {AppComponent} from './app.component';
import '../styles/styles.scss';
import 'hammerjs';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule, MdListModule} from '@angular/material';
import {LoginComponent} from './pages/login/login.component';
import {RadiostationByFeatureComponent} from './components/create-radiostation/by-feature/radiostation-by-feature.component';
import {RadiostationService} from './services/radiostation.service';
import {RadiostationBySongComponent}   from './components/create-radiostation/by-song/radiostation-by-song.component';
import {PlayerComponent} from './pages/player/player.component';
import {MdInputModule} from '@angular/material';
import {MdCardModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import {MdDialogModule} from '@angular/material';
import {MdIconModule} from '@angular/material';
import {TrackListComponent} from './components/track-list/track-list.component';
import {TrackService} from './services/track.service';
import {SecondsToDatePipe} from './pipes/seconds-to-date.pipe';
import {CurrentTrackComponent} from './components/current-track/current-track.component';
import {SpecialFeedbackDialogComponent} from './components/dialogs/special-feedback/special-feedback-dialog.component';
import {TendencyFeedbackDialogComponent} from './components/dialogs/tendency-feedback/tendency_feedback-dialog.component';
import {CookieModule, CookieService} from 'ngx-cookie';
import {AuthService} from './services/auth/auth.service';
import {AuthHttp} from './services/auth/auth-http';
import {AuthGuard} from './guards/AuthGuard';
import {SpeechService} from './services/speech.service';
import {PlayerControlBarComponent} from './components/player-control-bar/player-control-bar.component';
import {SpeechSearchFieldComponent} from './components/speech-search-field/speech-search-field.component';
import {SimpleSearchComponent} from './components/simple-search/simple-search.component';
import {PlayerService} from './services/player.service';
import {FeedbackService} from './services/feedback.service';
import {HistoryService} from "./services/history.service";
import {HistoryListComponent} from "./components/history-list/history-list.component";
import {TrackListItemComponent} from './components/track-list/track-list-item/track-list-item.component';
import {DialogService} from './services/dialog.service';


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        LoginComponent,
        RadiostationByFeatureComponent,
        RadiostationBySongComponent,
        PlayerComponent,
        TrackListComponent,
        CurrentTrackComponent,
        PlayerControlBarComponent,
        SpecialFeedbackDialogComponent,
        TendencyFeedbackDialogComponent,
        SpeechSearchFieldComponent,
        SecondsToDatePipe,
        SimpleSearchComponent,
        HistoryListComponent,
        TrackListItemComponent
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
        MdDialogModule, MdIconModule,
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
        SpecialFeedbackDialogComponent,
        TendencyFeedbackDialogComponent
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
        TrackService,
        RadiostationService,
        SpeechService,
        FeedbackService,
        PlayerService,
        HistoryService

    ]
})
export class AppModule {

}

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}