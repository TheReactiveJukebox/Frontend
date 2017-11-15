import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, Output} from '@angular/core';
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
export class RadiostationByFeatureComponent {

    public genres: string[] = [];
    //mocked moods
    public moods: string[] = ['crazy', 'happy', 'sad'];

    public speedLowerLimit: number = Config.speedLowerLimit;
    public speedUpperLimit: number = Config.speedUpperLimit;
    public dynamicLowerLimit: number = Config.dynamicLowerLimit;
    public dynamicUpperLimit: number = Config.dynamicUpperLimit;
    public yearLowerLimit: number = Config.yearLowerLimit;
    public yearUpperLimit: number = Config.yearUpperLimit;

    private genreApiUrl: string = Config.serverUrl + '/api/genre';  // URL to web api

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
        this.radiostationService.getRadiostationSubject().subscribe((radiostation: Radiostation) => {
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

    //resets the gui
    public resetRadiostation(): void {
        this.radiostation = new Radiostation();
        this.radiostation.algorithm = 'RANDOM';
    }


    public start(): void {
        this.radiostationService.startNewRadiostation(this.radiostation).subscribe(() => {
            this.onStart.emit();
            this.playerService.play();
        });
    }

    public update(): void {
        this.radiostationService.updateRadiostation(this.radiostation).subscribe(() => {
            this.onStart.emit();
        });
    }

    //opens a dialog to select the constraint to specify
    public selectConstraint(): void {
        let dialogRef = this.dialog.open(AddConstraintDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            this.addConstraint(result);
        });
    }

    //adds an element to the gui for the keywords
    public addConstraint(result: string): void {
        //there can be an unlimetd number of genre elements
        if (result == 'genre') {
            if (this.radiostation.genres == null) {
                this.radiostation.genres = [];
            }
            this.radiostation.genres.push(this.genres[0]);
        } else if (result == 'mood') {
            if (this.radiostation.mood == null) {
                this.radiostation.mood = this.moods[0];
            } else {
                this.showWarning();
            }
        } else if (result == 'year-end') {
            if (this.radiostation.endYear == null) {
                this.radiostation.endYear = this.getMaxYear();
            } else {
                this.showWarning();
            }
        } else if (result == 'year-start') {
            if (this.radiostation.startYear == null) {
                this.radiostation.startYear = this.getMinYear();
            } else {
                this.showWarning();
            }
        } else if (result == 'speed') {
            if (this.radiostation.speed == null) {
                this.radiostation.speed = (this.speedLowerLimit + this.speedUpperLimit) / 2;
            } else {
                this.showWarning();
            }
        } else if (result == 'dynamic') {
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
