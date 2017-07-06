import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {RadiostationByFeatureComponent} from './pages/create-radiostation/by-feature/radiostation-by-feature.component';
import {RadiostationBySongComponent}   from './pages/create-radiostation/by-song/radiostation-by-song.component';
import {PlayerComponent} from './pages/player/player.component';
import {AuthGuard} from './guards/AuthGuard';
import {SpeechSearchFieldComponent} from './components/speech-search-field/speech-search-field.component';
import {SimpleSearchComponent} from './components/simple-search/simple-search.component'

export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: '/player',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'player',
        component: PlayerComponent,
        canActivate: [AuthGuard]
    },

];
