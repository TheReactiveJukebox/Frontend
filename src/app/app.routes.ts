import {Routes} from '@angular/router';
import {AuthGuard} from './guards/AuthGuard';
import {LoginComponent} from './pages/login/login.component';
import {PlayerComponent} from './pages/player/player.component';

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
