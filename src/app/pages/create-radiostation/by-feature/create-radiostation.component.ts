import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../services/app.service';
import { CreateRadiostationService } from '../../../services/create-radiostation.service';

@Component({
    selector: 'create-radiostation',
    styleUrls: [ './create-radiostation.component.css' ],
    templateUrl: './create-radiostation.component.html'
})
export class CreateRadiostationComponent implements OnInit {
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
