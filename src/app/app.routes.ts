import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CreateRadiostationComponent } from './pages/create-radiostation/create-radiostation.component';
import { PlayerComponent } from './pages/player/player.component';

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
    },{
        path: 'player',
        component: PlayerComponent
    },
];
