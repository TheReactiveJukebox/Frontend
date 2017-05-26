import { Component, OnInit } from '@angular/core';
import { AppState } from '../../services/app.service';

@Component({
    selector: 'player',
    styleUrls: [ './player.component.css' ],
    templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {
    public ngOnInit() {
        console.log('hello `Player` component');
    }
}
