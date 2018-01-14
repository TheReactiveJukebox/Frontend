import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import 'hammerjs';
import '../styles/styles.scss';
// App is our top level component
import {AppComponent} from './app.component';
import {ROUTES} from './app.routes';
/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';

import {
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdListModule, MdProgressSpinnerModule,
    MdSelectModule,
    MdSliderModule,
    MdSnackBarModule,
    MdTabsModule,
    MdTooltipModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {CookieModule, CookieService} from 'ngx-cookie';
import {RadiostationByFeatureComponent} from './components/create-radiostation/by-feature/radiostation-by-feature.component';
import {CurrentTrackComponent} from './components/current-track/current-track.component';
import {HistoryListComponent} from './components/history-list/history-list.component';
import {LikeComponent} from './components/like/like.component';
import {MoodSelectorComponent} from './components/mood-selector/mood-selector.component';
import {PageTitleComponent} from './components/page-title/page-title.component';
import {PlayerControlBarComponent} from './components/player-control-bar/player-control-bar.component';
import {SimpleSearchComponent} from './components/simple-search/simple-search.component';
import {SpeechSearchFieldComponent} from './components/speech-search-field/speech-search-field.component';
import {TrackListItemComponent} from './components/track-list/track-list-item/track-list-item.component';
import {TrackListComponent} from './components/track-list/track-list.component';
import {AuthGuard} from './guards/AuthGuard';
import {LoginComponent} from './pages/login/login.component';
import {PlayerComponent} from './pages/player/player.component';
import {SecondsToDatePipe} from './pipes/seconds-to-date.pipe';
import {AuthHttp} from './services/auth/auth-http';
import {AuthService} from './services/auth/auth.service';
import {FeedbackService} from './services/feedback.service';
import {HistoryService} from './services/history.service';
import {IndirectFeedbackService} from './services/indirect-feedback.service';
import {PlayerService} from './services/player.service';
import {RadiostationService} from './services/radiostation.service';
import {SpeechService} from './services/speech.service';
import {TrackService} from './services/track.service';
import {RangeSelectorComponent} from './components/range-selector/range-selector.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {SurveyService} from './services/survey.service';
import {OpenSurveyComponent} from './components/dialogs/open-survey/open-survey.component';
import {TileComponent} from './components/create-radiostation/by-feature/tile/tile.component';
import {StartTrackComponent} from './components/create-radiostation/by-feature/start-track/start-track.component';
import {GlobalErrorHandler} from './services/global-error-handler';
import {LoggingService} from './services/logging.service';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        LoginComponent,
        RadiostationByFeatureComponent,
        PlayerComponent,
        TrackListComponent,
        CurrentTrackComponent,
        PlayerControlBarComponent,
        SpeechSearchFieldComponent,
        SecondsToDatePipe,
        SimpleSearchComponent,
        HistoryListComponent,
        TrackListItemComponent,
        PageTitleComponent,
        LikeComponent,
        MoodSelectorComponent,
        RangeSelectorComponent,
        WelcomeComponent,
        OpenSurveyComponent,
        TileComponent,
        StartTrackComponent
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
        MdButtonModule, MdCheckboxModule, MdInputModule, MdCardModule, MdTabsModule, MdListModule, MdProgressSpinnerModule,
        MdDialogModule, MdIconModule, MdSelectModule, MdSnackBarModule, MdSliderModule, MdTooltipModule,
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
        OpenSurveyComponent,
        SimpleSearchComponent
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
        HistoryService,
        IndirectFeedbackService,
        SurveyService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },
        LoggingService
    ]
})
export class AppModule {

}

export function createTranslateLoader(http: Http): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
