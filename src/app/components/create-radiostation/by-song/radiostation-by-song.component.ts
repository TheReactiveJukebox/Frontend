import {Component, EventEmitter, Output} from '@angular/core';
import {RadiostationService} from '../../../services/radiostation.service';
import {PlayerService} from '../../../services/player.service';

@Component({
    selector: 'my-radiostation-by-song',
    templateUrl: './radiostation-by-song.component.html',
    styleUrls: ['./radiostation-by-song.component.scss']

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

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();

    constructor(public radiostationService: RadiostationService,
                public playerService: PlayerService) {
    }

    reset() {
    }

    start() {
        this.creationParameters.random = true;
        this.radiostationService.startNewRadiostation(this.creationParameters);
        this.playerService.play();
        this.onStart.emit();
    }
}