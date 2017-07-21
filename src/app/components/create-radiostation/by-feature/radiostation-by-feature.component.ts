import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppState} from '../../../services/app.service';
import {RadiostationService} from '../../../services/radiostation.service';
import {PlayerService} from '../../../services/player.service';
import {AddConstraintDialogComponent} from '../../dialogs/add-constraint/add-constraint-dialog.component';
import {MdDialog} from '@angular/material';
import {Config} from '../../../config';
import {AuthHttp} from '../../../services/auth/auth-http';

@Component({
    selector: 'radiostation-by-feature',
    styleUrls: ['./radiostation-by-feature.component.scss'],
    templateUrl: './radiostation-by-feature.component.html'
})
export class RadiostationByFeatureComponent implements OnInit {

    private genreApiUrl = Config.serverUrl + '/api/genre/list';  // URL to web api

    creationParameters: {
        id?: number,
        genres?: string[],
        mood?: string,
        startYear?: number,
        endYear?: number,
        random?: boolean
    } = {};

    tiles = [];
    genres = [];
    //mocked moods
    moods = [{name: 'crazy', id: 1}, {name: 'happy', id: 2}, {name: 'sad', id: 3}];
    tile_id: number = 1;

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();

    constructor(public radiostationService: RadiostationService,
                private playerService: PlayerService,
                public dialog: MdDialog, private authHttp: AuthHttp) {
        //fetch the available genres from server
        this.authHttp.get(this.genreApiUrl).subscribe((genreList: string[]) => {
            this.genres = genreList;
        }, error => {
            //this shit should not happen
        })
        //TODO: load available moods
    }

    ngOnInit(): void {

    }

    //resets the gui
    reset() {
        this.tiles = [];
    }


    start() {
        //remove the creationparameters from the last call
        this.resetCreationParameters();
        //set the corresponding parameter
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
                this.creationParameters.endYear = +tile.value;
            }
            if (tile.type == 'year-start') {
                this.creationParameters.startYear = +tile.value;
            }
        }
        //call server for radio
        this.radiostationService.startNewRadiostation(this.creationParameters);
        //start playing
        this.playerService.play();
        this.onStart.emit();
    }

    selectConstraint(): void {
        let dialogRef = this.dialog.open(AddConstraintDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            this.addConstraint(result);
        });
    }

    //adds an element to the gui for the keywords
    addConstraint(result: string): void {
        //there can be unlimetd genre elements
        if (result == 'genre') {
            this.tiles.push({type: 'genre', value: this.genres[0], id: this.tile_id++})
        }
        //check if the other elements already contained
        var contained = false;
        for (let entry of this.tiles) {
            if (entry.type == result) {
                contained = true;
            }
        }
        //create the element
        if (!contained) {
            if (result == 'mood') {
                this.tiles.push({type: 'mood', value: this.moods[0].name, id: this.tile_id++})
            }
            if (result == 'year-end') {
                this.tiles.push({type: 'year-end', value: 2000, id: this.tile_id++})
            }
            if (result == 'year-start') {
                this.tiles.push({type: 'year-start', value: 2000, id: this.tile_id++})
            }
        }
    }

    remove(key: number): void {
        let tmpTiles = [];
        for (let tile of this.tiles) {
            if (tile.id != key) {
                tmpTiles.push(tile);
            }
        }
        this.tiles = tmpTiles;
    }

    //resets the creation parameters to avoid, that old parameters will be used
    resetCreationParameters(): void {
        this.creationParameters.genres = null;
        this.creationParameters.mood = null;
        this.creationParameters.startYear = 0;
        this.creationParameters.endYear = 2099;
        this.creationParameters.random = false;
    }
}