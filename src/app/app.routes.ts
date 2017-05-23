import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { AboutComponent } from './pages/about';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
];
