import { Component, OnInit } from '@angular/core';
import { AppState } from '../../services/app.service';
import { AuthHttp } from '../../services/auth/auth-http';
import { Config } from '../../config';

@Component({
    selector: 'player',
    styleUrls: [ './player.component.css' ],
    templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {

    message: string;

    constructor(private authHttp: AuthHttp) {

    }

    public ngOnInit() {
        console.log('hello `Player` component');
    }

    public test(): void {
        this.authHttp.get(Config.serverUrl + '/api/hello/Hi').subscribe((res: Response) => {
            res.json().then(data => {
               this.message = data;
            });
        });
    }

}
