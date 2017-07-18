import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppState} from '../../../services/app.service';
import {RadiostationService} from '../../../services/radiostation.service';
import {PlayerService} from '../../../services/player.service';

@Component({
    selector: 'radiostation-by-feature',
    styleUrls: ['./radiostation-by-feature.component.css'],
    templateUrl: './radiostation-by-feature.component.html'
})
export class RadiostationByFeatureComponent implements OnInit {

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
                private playerService: PlayerService) {
    }

    tiles = [
        {type: 'genre', value: 'rock'},
        {type: 'mood', value: 'crazy'},
        {type: 'year-start', value: '1900'},
        {type: 'year-end', value: '2017'}
    ];

    genres = [{name: 'rock', id: 1}, {name: 'pop', id: 2}, {name: 'klassik', id: 3}];
    moods = [{name: 'crazy', id: 1}, {name: 'happy', id: 2}, {name: 'sad', id: 3}]


    ngOnInit(): void {
        //TODO: load genres
        //TODO: load available moods
    }

    reset() {
        this.tiles = [];
    }


    start() {
        this.creationParameters.random = true;
        this.radiostationService.startNewRadiostation(this.creationParameters);
        this.playerService.play();
        this.onStart.emit();
    }

    addConstraint(): void {

    }
}
