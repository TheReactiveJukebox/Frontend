import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';

@Component({
    selector: 'player',
    styleUrls: ['./player.component.scss'],
    templateUrl: './player.component.html'
})
export class PlayerComponent {

    constructor(public authService: AuthService) {
    }
}
