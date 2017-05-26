import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'about',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {

    public localState: any;
    constructor(
        public route: ActivatedRoute
    ) {}

    public ngOnInit() {
        this.route.data.subscribe((data: any) => {
            this.localState = data.yourData;
        });

        console.log('hello `Login` component');
    }

    login(): void {
        console.log('Login pressed!');
    }

    register(): void {
        console.log('Register pressed!');
    }

}
