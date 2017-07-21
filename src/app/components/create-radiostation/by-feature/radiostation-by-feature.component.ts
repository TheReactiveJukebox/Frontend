import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppState} from '../../../services/app.service';
import {RadiostationService} from '../../../services/radiostation.service';
import {PlayerService} from '../../../services/player.service';
import {AddConstraintDialogComponent} from '../../dialogs/add-constraint/add-constraint-dialog.component';
import {MdDialog, MdSnackBar} from '@angular/material';
import {Config} from '../../../config';
import {AuthHttp} from '../../../services/auth/auth-http';

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
        startYear?: number,
        endYear?: number,
        random?: boolean
    } = {};

    //keys should hold all identifing strings for the feature tiles
    keys = {genre: 'genre', mood: 'mood', endYear: 'year-end', startYear: 'year-start'};

    /* tiles should be filled with
    {type: key of the feature to set,
    value: default value and the field to store the selection,
    id: automatic id to identify the tile e.g. for deletion} */
    tiles = [];
    genres = [];
    //mocked moods
    moods = ['crazy', 'happy', 'sad'];
    tileId: number = 0;


    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();
    private genreApiUrl = Config.serverUrl + '/api/genre/list';  // URL to web api

    constructor(public radiostationService: RadiostationService,
                private playerService: PlayerService,
                public dialog: MdDialog, private authHttp: AuthHttp,
                public snackBar: MdSnackBar) {
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
            if (tile.type == this.keys.genre) {
                if (this.creationParameters.genres == null) {
                    this.creationParameters.genres = [tile.value];
                } else {
                    this.creationParameters.genres.push(tile.value);
                }
            }
            if (tile.type == this.keys.mood) {
                this.creationParameters.mood = tile.value;
            }
            if (tile.type == this.keys.endYear) {
                this.creationParameters.endYear = +tile.value;
            }
            if (tile.type == this.keys.startYear) {
                this.creationParameters.startYear = +tile.value;
            }
        }
        //call server for radio
        this.radiostationService.startNewRadiostation(this.creationParameters);
        //start playing
        this.playerService.play();
        this.onStart.emit();
    }

    //opens a dialog to select the constraint to specify
    selectConstraint(): void {
        let dialogRef = this.dialog.open(AddConstraintDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            this.addConstraint(result);
        });
    }

    //adds an element to the gui for the keywords
    addConstraint(result: string): void {
        //there can be an unlimetd number of genre elements
        if (result == this.keys.genre) {
            this.tiles.push({type: this.keys.genre, value: this.genres[0], id: this.tileId++})
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
            if (result == this.keys.mood) {
                this.tiles.push({type: this.keys.mood, value: this.moods[0], id: this.tileId++})
            }
            if (result == this.keys.endYear) {
                this.tiles.push({type: this.keys.endYear, value: 2000, id: this.tileId++})
            }
            if (result == this.keys.startYear) {
                this.tiles.push({type: this.keys.startYear, value: 2000, id: this.tileId++})
            }
        } else {
            this.snackBar.open('already contained', '',{
                duration: 2000,
            });
        }
    }

    //removes the tile with the specified key from the tiles array
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