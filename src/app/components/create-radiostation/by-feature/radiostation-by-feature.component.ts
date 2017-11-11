import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {Config} from '../../../config';
import {Radiostation} from '../../../models/radiostation';
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

    keys = {genre: 'genre', mood: 'mood', endYear: 'year-end', startYear: 'year-start', speed: 'speed', dynamic: 'dynamic'};
    genres = [];
    //mocked moods
    moods = ['crazy', 'happy', 'sad'];
    tileId: number = 0;

    public speedLowerLimit = Config.speedLowerLimit;
    public speedUpperLimit = Config.speedUpperLimit;
    public dynamicLowerLimit = Config.dynamicLowerLimit;
    public dynamicUpperLimit = Config.dynamicUpperLimit;
    public yearLowerLimit = Config.yearLowerLimit;
    public yearUpperLimit = Config.yearUpperLimit;

    private genreApiUrl = Config.serverUrl + '/api/genre';  // URL to web api

    public radiostation: Radiostation;

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();

    constructor(public radiostationService: RadiostationService,
                private playerService: PlayerService,
                private translateService: TranslateService,
                public dialog: MdDialog,
                private authHttp: AuthHttp,
                public snackBar: MdSnackBar) {
        this.resetRadiostation();
        this.radiostationService.getJukeboxSubject().subscribe((radiostation: Radiostation) => {
            if (radiostation != null) {
                this.radiostation = radiostation;
            }
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

    //resets the gui
    public resetRadiostation(): void {
        this.radiostation = new Radiostation();
        this.radiostation.algorithm = 'RANDOM';
    }


    public start(): void {
        console.log('RADIOSTATION BEFORE: ', this.radiostation);
        this.radiostationService.startNewRadiostation(this.radiostation).subscribe(() => {
            this.onStart.emit();
            this.playerService.play();
        });
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
            if (this.radiostation.genres == null) {
                this.radiostation.genres = [];
            }
            this.radiostation.genres.push(this.genres[0]);
        } else if (result == this.keys.mood) {
            if (this.radiostation.mood == null) {
                this.radiostation.mood = this.moods[0];
            } else {
                this.showWarning();
            }
        } else if (result == this.keys.endYear) {
            if (this.radiostation.endYear == null) {
                this.radiostation.endYear = this.getMaxYear();
            } else {
                this.showWarning();
            }
        } else if (result == this.keys.startYear) {
            if (this.radiostation.startYear == null) {
                this.radiostation.startYear = this.getMinYear();
            } else {
                this.showWarning();
            }
        } else if (result == this.keys.speed) {
            if (this.radiostation.speed == null) {
                this.radiostation.speed = (this.speedLowerLimit + this.speedUpperLimit) / 2;
            } else {
                this.showWarning();
            }
        } else if (result == this.keys.dynamic) {
            if (this.radiostation.dynamic == null) {
                this.radiostation.dynamic = (this.dynamicLowerLimit + this.dynamicUpperLimit) / 2;
            } else {
                this.showWarning();
            }
        }
    }

    public removeProperty(property: string): void {
        this.radiostation[property] = null;
    }

    public removeGenre(index: number): void {
        this.radiostation.genres.splice(index, 1);
    }

    private showWarning(): void {
        this.snackBar.open(this.translateService.instant('ADD_CONSTRAINT.ALREADY_CONTAINED'), '', {
            duration: 2000,
        });
    }

    public getMinYear(): number {
        if (this.radiostation.startYear) {
            return Math.max(Config.yearLowerLimit, this.radiostation.startYear);
        } else {
            return Config.yearLowerLimit;
        }
    }

    public getMaxYear(): number {
        if (this.radiostation.endYear) {
            return Math.min(Config.yearUpperLimit, this.radiostation.endYear);
        } else {
            return Config.yearUpperLimit;
        }
    }

    public getKeys(): string[] {
        let ignoredKeys: string[] = ['id', 'userId', 'genres', 'startTracks', 'algorithm'];
        let keys = [];
        for (let key in this.radiostation) {
            if (this.radiostation[key] != null && ignoredKeys.indexOf(key) == -1) {
                keys.push(key);
            }
        }
        return keys;
    }
}
