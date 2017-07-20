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
        startyear?: number,
        endyear?: number,
        random?: boolean
    } = {};

    tiles = [];
    //genres = [];
    genres = ['rock', 'pop', 'classic', 'electronic', 'metal', '80s', 'hip hop','2000s','jazz','blues','folk' ];
    moods = [{name: 'crazy', id: 1}, {name: 'happy', id: 2}, {name: 'sad', id: 3}]

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();

    constructor(public radiostationService: RadiostationService,
                private playerService: PlayerService,
                public dialog: MdDialog, private authHttp: AuthHttp) {
        //TODO: load genres
       /* this.authHttp.get(this.genreApiUrl).subscribe((genreList: string[]) => {
            this.genres = genreList;
            console.log('genres: ', genreList);
        }, error => {
            //this shit should not happen
        });*/
        //TODO: load available moods
    }

    ngOnInit(): void {

    }

    reset() {
        this.tiles = [];
    }


    start() {
        this.resetCreationParameters();
        for (let tile of this.tiles) {
            console.log('tiles: ', tile)
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
        console.log('Radio Parameters: ', this.creationParameters);
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
        if (result == 'genre') {
            this.tiles.push({type: 'genre', value: this.genres[0]})
        }
        var contained = false;
        for (let entry of this.tiles) {
            if (entry.type == result) {
                contained = true;
            }
        }
        if (contained) {
            //TODO show pop up
        } else {
            if (result == 'mood') {
                this.tiles.push({type: 'mood', value: this.moods[0].name})
            }
            if (result == 'year-end') {
                this.tiles.push({type: 'year-end', value: 2000})
            }
            if (result == 'year-start') {
                this.tiles.push({type: 'year-start', value: 2000})
            }
        }

    }

    resetCreationParameters(): void {
        this.creationParameters.genres = null;
        this.creationParameters.mood = null;
        this.creationParameters.startyear = 0;
        this.creationParameters.endyear = 2099;
    }
}