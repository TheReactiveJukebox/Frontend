import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // user is logged in and has rights to access
        if (this.authService.isLoggedIn()) {
            return true;
        } else { // user isn't logged in and has no rights to access. redirect to login page
            console.log('[AuthGuard] Performing autologin!');
            this.authService.performAutoLogin().subscribe(() => {
                this.router.navigate([state.url]);
            }, err => {
                console.log(err);
                this.router.navigate(['/login']);
            });
            return false;
        }
    }
}
