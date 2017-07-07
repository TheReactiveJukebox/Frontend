import {Component, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {MdTabGroup} from '@angular/material';

@Component({
    selector: 'player',
    styleUrls: ['./player.component.scss'],
    templateUrl: './player.component.html'
})
export class PlayerComponent {

    @ViewChild('tabs')
    tabs: MdTabGroup;

    constructor(public authService: AuthService) {
        //this.tabs.selectedIndex = 0;
    }
}
