import {Component} from '@angular/core';
import {RadiostationService} from '../../../services/radiostation.service';
import {PlayerService} from '../../../services/player.service';

@Component({
    selector: 'my-radiostation-by-song',
    templateUrl: './radiostation-by-song.component.html',
    styleUrls: ['./radiostation-by-song.component.css']

})
export class RadiostationBySongComponent {

    creationParameters: {
        id?: number,
        genres?: string[],
        mood?: string,
        startyear?: number,
        endyear?: number,
        random?: boolean
    } = {};

    constructor(public radiostationService: RadiostationService,
                public playerService: PlayerService) {
    }

    reset(event) {
    }

    start(event) {
        this.creationParameters.random = true;
        this.radiostationService.startNewRadiostation(this.creationParameters);
        this.playerService.play();
        //TODO: Switch to radiostation view
    }
}