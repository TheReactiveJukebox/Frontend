import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppState} from '../../../services/app.service';
import {RadiostationService} from '../../../services/radiostation.service';
import {PlayerService} from '../../../services/player.service';

@Component({
    selector: 'radiostation-by-feature',
    styleUrls: [ './radiostation-by-feature.component.css' ],
    templateUrl: './radiostation-by-feature.component.html'
})
export class RadiostationByFeatureComponent implements OnInit {

    creationParameters:
        {
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
                private playerService: PlayerService) {}

    ngOnInit(): void {
    }

    reset() {
    }
    start() {
        this.creationParameters.random=true;
        this.radiostationService.startNewRadiostation(this.creationParameters);
        this.playerService.play();
        this.onStart.emit();
    }
}
