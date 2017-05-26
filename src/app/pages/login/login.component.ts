import { Component, Host, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'about',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {

    public localState: any;
    constructor(
        public route: ActivatedRoute,
        public parent: AppComponent
    ) {}

    public ngOnInit() {
        this.route.data.subscribe((data: any) => {
            this.localState = data.yourData;
        });

        console.log('hello `Login` component');

        this.parent.tintBackground('#4CAF50');
    }

    login(): void {
        console.log('Login pressed!');
        this.parent.tintBackground('#FFFFFF');
    }

    register(): void {
        console.log('Register pressed!');
    }

}
