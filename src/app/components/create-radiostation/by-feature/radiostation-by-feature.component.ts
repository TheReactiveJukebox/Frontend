import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppState} from '../../../services/app.service';
import {RadiostationService} from '../../../services/radiostation.service';
import {PlayerService} from '../../../services/player.service';
import {AddConstraintDialogComponent} from '../../dialogs/add-constraint/add-constraint-dialog.component';
import {MdDialog, MdSnackBar} from '@angular/material';

@Component({
    selector: 'radiostation-by-feature',
    styleUrls: ['./radiostation-by-feature.component.scss'],
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
                private playerService: PlayerService,
                public dialog: MdDialog
                ) {
    }

    tiles = [];

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
        for (let tile of this.tiles) {
            if (tile.type == 'genre') {
                if (this.creationParameters.genres == null) {
                    this.creationParameters.genres = [tile.value];
                } else {
                    this.creationParameters.genres.push(tile.value);
                }
            }
            if (tile.type == 'mood') {
                this.creationParameters.mood = tile.value;
            }
            if (tile.type == 'year-end') {
                this.creationParameters.endyear = +tile.value;
            }
            if (tile.type == 'year-start') {
                this.creationParameters.startyear = +tile.value;
            }
        }
        this.radiostationService.startNewRadiostation(this.creationParameters);
        this.playerService.play();
        this.onStart.emit();
    }

    selectConstraint(): void {
        let dialogRef = this.dialog.open(AddConstraintDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            this.addConstraint(result);
        });
    }

    addConstraint(result: string): void {
        if ( result == 'genre') {
            this.tiles.push({type: 'genre', value: this.genres[0].name})
        }
        var contained = false;
        for (let entry of this.tiles) {
            if(entry.type == result) {
                contained = true;
            }
        }
        if (contained) {
           // this.snackBar.open('Property already existing!');
        } else {
            if (result == 'mood') {
                this.tiles.push({type: 'mood', value: this.moods[0].name})
            }
            if (result == 'year-end') {
                this.tiles.push({type: 'year-end', value: '2000'})
            }
            if (result == 'year-start') {
                this.tiles.push({type: 'year-start', value: '2000'})
            }
        }

    }
}