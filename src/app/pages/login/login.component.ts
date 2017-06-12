import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'about',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {

    loginData: {username?: string, password?: string} = {};

    constructor(public parent: AppComponent,
                private authService: AuthService,
                private router: Router) {}

    public ngOnInit() {
        this.parent.tintBackground('#4CAF50');
    }

    login(): void {
        console.log('Login pressed!');
        this.authService.login(this.loginData).subscribe(() => {
            this.parent.tintBackground('#FFFFFF');
            this.router.navigate(['/player']);
        }, error => {
            console.log('Login failed!');
        });
    }

    register(): void {
        console.log('Register pressed!');
        this.authService.registerUser(this.loginData).subscribe(data => {
            this.parent.tintBackground('#FFFFFF');
            this.router.navigate(['/player']);
        }, error => {
            alert('Login failed. Please try again!');
            console.log('Register failed!');
        });
    }

}
