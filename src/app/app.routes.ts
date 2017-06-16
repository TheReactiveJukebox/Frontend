import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {PlayerComponent} from './pages/player/player.component';
import {AuthGuard} from './guards/AuthGuard';
import {SpeechComponent} from './pages/speech/speech.component';

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
        path: 'player',
        component: PlayerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'speech',
        component: SpeechComponent,
    },
];
