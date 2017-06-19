import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import { CreateRadiostationComponent } from './pages/create-radiostation/by-feature/create-radiostation.component';
import { RadiostationBySongComponent }   from './pages/create-radiostation/by-song/radiostation-by-song.component';
import {PlayerComponent} from './pages/player/player.component';
import {AuthGuard} from './guards/AuthGuard';
import {SpeechComponent} from './components/speech-search-field/speech-search-field.component';

export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'create-radiostation',
        component: CreateRadiostationComponent
    },
    {
        path: 'radiostation-by-song',
        component: RadiostationBySongComponent
    },
    {
        path: 'player',
        component: PlayerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'speech',
        component: SpeechComponent,
    },
];
