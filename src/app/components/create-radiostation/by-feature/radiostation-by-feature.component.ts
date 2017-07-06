import {Component, OnInit} from '@angular/core';
import {AppState} from '../../../services/app.service';
import {RadiostationService} from '../../../services/radiostation.service';

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

    constructor(public radiostationService: RadiostationService) {}

    ngOnInit(): void {
    }

    reset(event) {
    }
    start(event) {
        this.creationParameters.random=true;
        this.radiostationService.startNewRadiostation(this.creationParameters);
    }
}
