import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {Config} from '../../../config';
import {Jukebox} from '../../../models/jukebox';
import {AuthHttp} from '../../../services/auth/auth-http';
import {PlayerService} from '../../../services/player.service';
import {RadiostationService} from '../../../services/radiostation.service';
import {AddConstraintDialogComponent} from '../../dialogs/add-constraint/add-constraint-dialog.component';

@Component({
    selector: 'radiostation-by-feature',
    styleUrls: ['./radiostation-by-feature.component.scss'],
    templateUrl: './radiostation-by-feature.component.html',
    animations: [
        trigger('expand', [
            state('true', style({'width': '*'})),
            state('void', style({'width': '0px'})),
            transition('void => *', animate('0.3s ease-out')),
            transition('* => void', animate('0.3s ease-out'))
        ])
    ]
})
export class RadiostationByFeatureComponent implements OnInit {

    creationParameters:
        {
            id?: number,
            genres?: string[],
            mood?: string,
            startYear?: number,
            endYear?: number,
            algorithm?: string,
            speed?: number,
            dynamic?: number,
        } = {};

    //keys should hold all identifing strings for the feature tiles
    keys = {genre: 'genre', mood: 'mood', endYear: 'year-end', startYear: 'year-start', speed: 'speed', dynamic: 'dynamic'};

    /* tiles should be filled with
    {type: key of the feature to set,
    value: default value and the field to store the selection,
    id: automatic id to identify the tile e.g. for deletion} */
    tiles = [];
    genres = [];
    //mocked moods
    moods = ['crazy', 'happy', 'sad'];
    tileId: number = 0;

    public speedLowerLimit = Config.speedLowerLimit;
    public speedUpperLimit = Config.speedUpperLimit;
    public dynamicLowerLimit = Config.dynamicLowerLimit;
    public dynamicUpperLimit = Config.dynamicUpperLimit;

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();
    private genreApiUrl = Config.serverUrl + '/api/genre';  // URL to web api

    constructor(public radiostationService: RadiostationService,
                private playerService: PlayerService,
                private translateService: TranslateService,
                public dialog: MdDialog,
                private authHttp: AuthHttp,
                public snackBar: MdSnackBar) {
        this.radiostationService.getJukeboxSubject().subscribe((jukebox: Jukebox) => {
            this.refresh(jukebox);
        });

        //fetch the available genres from server
        this.authHttp.get(this.genreApiUrl).subscribe((genreList: string[]) => {
            this.genres = genreList;
        }, error => {
            //should not happen since this was a static request
            console.log('It seems that the API-Endpoint /genre is not working properly: ', error);
        });
        //TODO: load available moods
    }

    ngOnInit(): void {

    }

    private refresh(jukebox: Jukebox): void {
        if (jukebox) {
            this.tiles = [];
            this.tileId = 0;
            if (jukebox.genres) {
                for (let genre of jukebox.genres) {
                    this.tiles.push({type: this.keys.genre, value: genre, id: this.tileId++});
                }
            }
            if (jukebox.mood) {
                this.tiles.push({type: this.keys.mood, value: jukebox.mood, id: this.tileId++});
            }
            if (jukebox.startYear) {
                this.tiles.push({type: this.keys.startYear, value: jukebox.startYear, id: this.tileId++});
            }
            if (jukebox.endYear) {
                this.tiles.push({type: this.keys.endYear, value: jukebox.endYear, id: this.tileId++});
            }
            if (jukebox.speed) {
                this.tiles.push({type: this.keys.speed, value: jukebox.speed, id: this.tileId++});
            }
            if (jukebox.dynamic) {
                this.tiles.push({type: this.keys.dynamic, value: jukebox.dynamic, id: this.tileId++});
            }
        }
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
                this.creationParameters.endYear = tile.value;
            }
            if (tile.type == this.keys.startYear) {
                this.creationParameters.startYear = tile.value;
            }
            if (tile.type == this.keys.speed) {
                this.creationParameters.speed = tile.value;
            }
            if (tile.type == this.keys.dynamic) {
                this.creationParameters.dynamic = tile.value;
            }
        }
        //call server for radio
        this.creationParameters.algorithm = 'RANDOM';
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
            this.tiles.push({type: this.keys.genre, value: this.genres[0], id: this.tileId++});
        } else {
            //check if the other elements already contained
            let contained = false;
            for (let entry of this.tiles) {
                if (entry.type == result) {
                    contained = true;
                }
            }
            //create the element
            if (!contained) {
                if (result == this.keys.mood) {
                    this.tiles.push({type: this.keys.mood, value: this.moods[0], id: this.tileId++});
                }
                if (result == this.keys.endYear) {
                    this.tiles.push({type: this.keys.endYear, value: this.getMaxYear(), id: this.tileId++});
                }
                if (result == this.keys.startYear) {
                    this.tiles.push({type: this.keys.startYear, value: this.getMinYear(), id: this.tileId++});
                }
                if (result == this.keys.speed) {
                    this.tiles.push({type: this.keys.speed,
                        value: (this.speedLowerLimit + this.speedUpperLimit) / 2, id: this.tileId++});
                }
                if (result == this.keys.dynamic) {
                    this.tiles.push({type: this.keys.dynamic,
                        value: (this.dynamicLowerLimit + this.dynamicUpperLimit) / 2, id: this.tileId++});
                }
            } else {
                this.snackBar.open(this.translateService.instant('ADD_CONSTRAINT.ALREADY_CONTAINED'), '', {
                    duration: 2000,
                });
            }
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
        this.creationParameters.startYear = null;
        this.creationParameters.endYear = null;
        this.creationParameters.speed = null;
        this.creationParameters.dynamic = null;
    }

    public getMinYear(): number {
        if (this.creationParameters.startYear) {
            return Math.max(Config.yearLowerLimit, this.creationParameters.startYear);
        } else {
            return Config.yearLowerLimit;
        }
    }

    public getMaxYear(): number {
        if (this.creationParameters.endYear) {
            return Math.min(Config.yearUpperLimit, this.creationParameters.endYear);
        } else {
            return Config.yearUpperLimit;
        }
    }
}
