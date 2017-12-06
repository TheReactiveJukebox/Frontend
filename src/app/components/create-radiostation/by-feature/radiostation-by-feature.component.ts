import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, Output} from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {Config} from '../../../config';
import {Mood} from '../../../models/mood';
import {Radiostation} from '../../../models/radiostation';
import {AuthHttp} from '../../../services/auth/auth-http';
import {PlayerService} from '../../../services/player.service';
import {RadiostationService} from '../../../services/radiostation.service';
import {AddConstraintDialogComponent} from '../../dialogs/add-constraint/add-constraint-dialog.component';
import {TrackService} from '../../../services/track.service';


@Component({
    selector: 'radiostation-by-feature',
    styleUrls: ['./radiostation-by-feature.component.scss'],
    templateUrl: './radiostation-by-feature.component.html',
    animations: [
        trigger('expand', [
            state('true', style({'opacity': '1.0', 'width': '*', 'top': '0px'})),
            state('void', style({'opacity': '0.0', 'width': '0px', 'top': '100px'})),
            transition('void => *', animate('0.3s ease-out')),
            transition('* => void', animate('0.3s ease-out'))
        ])
    ]
})
export class RadiostationByFeatureComponent {

    public genres: string[] = [];

    public tiles: string[] = [];

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
                public trackService: TrackService,
                private playerService: PlayerService,
                private translateService: TranslateService,
                public dialog: MdDialog,
                private authHttp: AuthHttp,
                public snackBar: MdSnackBar) {
        this.resetRadiostation();
        this.radiostationService.getRadiostationSubject().subscribe((radiostation: Radiostation) => {
            if (radiostation != null) {
                this.tiles = [];
                this.radiostation = radiostation;
                console.log('Radiostation: ', radiostation);
                this.loadRadiostation();
            }
        });

        //fetch the available genres from server
        this.authHttp.get(this.genreApiUrl).subscribe((genreList: string[]) => {
            this.genres = genreList;
        }, error => {
            //should not happen since this was a static request
            console.log('It seems that the API-Endpoint /genre is not working properly: ', error);
        });
    }

    //resets the gui
    public resetRadiostation(): void {
        this.radiostation = new Radiostation();
        this.radiostation.algorithm = 'RANDOM';
        this.tiles = [];
    }


    public start(): void {
        // TODO: If we have some new algorithms, we need to change this default value
        this.radiostation.algorithm = 'RANDOM';
        this.radiostationService.startNewRadiostation(this.radiostation).subscribe(() => {
            this.onStart.emit();
            this.playerService.play();
        });
    }

    public update(): void {
        // TODO: If we have some new algorithms, we need to change this default value
        this.radiostation.algorithm = 'RANDOM';
        this.radiostationService.updateRadiostation(this.radiostation).subscribe(() => {
            this.onStart.emit();
        });
    }

    //opens a dialog to select the constraint to specify
    public selectConstraint(): void {
        let dialogRef = this.dialog.open(AddConstraintDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.addConstraint(result);
            }
        });
    }

    private loadRadiostation(): void {
        if (this.radiostation.minSpeed  != null || this.radiostation.maxSpeed != null) {
            this.tiles.push('speed');
        }

        if (this.radiostation.arousal != null || this.radiostation.valence != null) {
            this.tiles.push('mood');
        }

        if (this.radiostation.startYear  != null || this.radiostation.endYear != null) {
            this.tiles.push('year');
        }

        if (this.radiostation.genres != null && this.radiostation.genres.length > 0) {
            this.tiles.push('genres');
        }

        if (this.radiostation.dynamic != null) {
            this.tiles.push('dynamic');
        }
    }

    //adds an element to the gui for the keywords
    public addConstraint(result: string): void {
        if (this.tiles.indexOf(result) != -1) {
            this.showWarning();
        } else {
            this.tiles.push(result);
            switch (result) {
                case 'genres':
                    this.radiostation.genres = [];
                    break;
                case 'year':
                    this.radiostation.startYear = this.yearLowerLimit;
                    this.radiostation.endYear = this.yearUpperLimit;
                    break;
                case 'speed':
                    this.radiostation.minSpeed = this.speedLowerLimit;
                    this.radiostation.maxSpeed = this.speedUpperLimit;
                    break;
                case 'mood':
                    this.radiostation.arousal = 0;
                    this.radiostation.valence = 0;
                    break;
                case 'dynamic':
                    this.radiostation.dynamic = 0.5;
            }
        }
    }

    public removeProperty(property: string): void {
        switch (property) {
            case 'genres':
                this.radiostation.genres = null;
                break;
            case 'year':
                this.radiostation.startYear = null;
                this.radiostation.endYear = null;
                break;
            case 'speed':
                this.radiostation.minSpeed = null;
                this.radiostation.maxSpeed = null;
                break;
            case 'mood':
                this.radiostation.arousal = null;
                this.radiostation.valence = null;
                break;
            case 'dynamic':
                this.radiostation.dynamic = null;
        }
    }

    private showWarning(): void {
        this.snackBar.open(this.translateService.instant('ADD_CONSTRAINT.ALREADY_CONTAINED'), '', {
            duration: 2000,
        });
    }

    public setSelMood(pSelMood: Mood): void {
        this.radiostation.valence = pSelMood.valence;
        this.radiostation.arousal = pSelMood.arousal;
    }

}
