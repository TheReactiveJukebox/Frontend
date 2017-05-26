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
            /**
             * Your resolved data from route.
             */
            this.localState = data.yourData;
        });

        console.log('hello `About` component');
    }

    login(): void {
        console.log('Login pressed!');
    }

}
