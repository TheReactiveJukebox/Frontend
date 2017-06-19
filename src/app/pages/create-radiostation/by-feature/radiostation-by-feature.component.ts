import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../services/app.service';
import { CreateRadiostationService } from '../../../services/create-radiostation.service';

@Component({
    selector: 'radiostation-by-feature',
    styleUrls: [ './radiostation-by-feature.component.css' ],
    templateUrl: './radiostation-by-feature.component.html'
})
export class RadiostationByFeatureComponent implements OnInit {
    constructor(public createRadiostationService: CreateRadiostationService) {}

    ngOnInit(): void {
        console.log('Fooba');

        //this.createRadiostationService.refreshTracks();
    }

    reset(event) {
    }
    start(event) {
    }
}
