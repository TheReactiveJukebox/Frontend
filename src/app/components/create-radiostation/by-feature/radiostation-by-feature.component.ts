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
import {TrackService} from '../../../services/track.service';
import {SimpleSearchComponent} from '../../simple-search/simple-search.component';
import {Track} from '../../../models/track';
import {Utils} from '../../../utils';
import {LoggingService} from '../../../services/logging.service';


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
    public algorithms: string[] = [];
    public startTracks: Track[] = null;

    public speedLowerLimit: number = Config.speedLowerLimit;
    public speedUpperLimit: number = Config.speedUpperLimit;
    public dynamicLowerLimit: number = Config.dynamicLowerLimit;
    public dynamicUpperLimit: number = Config.dynamicUpperLimit;
    public yearLowerLimit: number;
    public yearUpperLimit: number = Config.yearUpperLimit;

    public study: boolean = Config.study;

    private genreApiUrl: string = Config.serverUrl + '/api/genre';  // URL to web api
    private trackParameterApiUrl: string = Config.serverUrl + '/api/track/parameter';

    public radiostation: Radiostation;

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();

    constructor(public radiostationService: RadiostationService,
                public trackService: TrackService,
                private playerService: PlayerService,
                private translateService: TranslateService,
                private loggingService: LoggingService,
                private snackBar: MdSnackBar,
                public dialog: MdDialog,
                private authHttp: AuthHttp) {
        this.resetRadiostation();
        this.radiostationService.getRadiostationSubject().subscribe((radiostation: Radiostation) => {
            if (radiostation != null) {
                this.radiostation = radiostation;
                if (radiostation.startTracks) {
                    // fetch information about the startTracks
                    this.trackService.loadTracksByIds(radiostation.startTracks).subscribe((tracks: Track[]) => {
                        this.startTracks = tracks;
                    });
                }
            }
        });
        this.radiostationService.getAlgorithms().subscribe((algorithms: string[]) => {
            this.algorithms = algorithms;
        });

        //fetch the available genres from server
        this.authHttp.get(this.genreApiUrl).subscribe((genreList: string[]) => {
            this.genres = genreList.sort().map((genre: string) => {
               return Utils.capitalize(genre);
            });
        }, error => {
            //should not happen since this was a static request
            this.genres = [];
            this.loggingService.error(this, 'Failed to fetch available genres!', error);
        });

        //fetch the the releaseDate of oldest song
        this.authHttp.get(this.trackParameterApiUrl).subscribe((data: any) => {
            this.yearLowerLimit = data.oldestTrack;
            this.speedLowerLimit = Math.floor(data.minSpeed);
            this.speedUpperLimit = Math.round(data.maxSpeed);
        }, error => {
            this.yearLowerLimit = 1800;
            this.speedLowerLimit = Config.speedLowerLimit;
            this.speedUpperLimit = Config.speedUpperLimit;
            this.loggingService.error(this, 'Failed to fetch available track parameters!', error);
        });
    }

    //resets the gui
    public resetRadiostation(): void {
        this.radiostation = new Radiostation();
        if (this.study) {
            this.radiostation.algorithm = 'RANDOM';
        } else {
            this.radiostation.algorithm = 'HYBRID';
        }
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

    //adds an element to the gui for the keywords
    public addConstraint(result: string): void {
        switch (result) {
            case 'genres':
                this.radiostation.genres = [];
                break;
            case 'titles':
                this.radiostation.startTracks = [];
                this.startTracks = [];
                break;
            case 'algorithm':
                this.radiostation.algorithm = '';
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
        }
    }

    public removeProperty(property: string): void {
        switch (property) {
            case 'genres':
                this.radiostation.genres = null;
                break;
            case 'titles':
                this.radiostation.startTracks = null;
                this.startTracks = null;
                break;
            case 'algorithm':
                this.radiostation.algorithm = null;
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
        }
    }

    public openStartTracksDialog(): void {
        let dialogRef = this.dialog.open(SimpleSearchComponent, {panelClass: 'search-dialog'});
        dialogRef.componentInstance.selectedTrack.subscribe(track => {
            // avoid duplicate startTracks
            if (!this.startTracks.some((element, index, array) => {return element.id == track.id; })) {
                if (this.startTracks.length < Config.startTrackLimit) {
                    this.startTracks.push(track);
                    this.radiostation.startTracks.push(track.id);
                    this.showToast(this.translateService.instant('RADIOSTATION_CREATE.SONG_ADDED'));
                } else {
                    this.showToast(this.translateService.instant('RADIOSTATION_CREATE.SONG_LIMIT'));
                }
            } else {
                this.showToast(this.translateService.instant('RADIOSTATION_CREATE.SONG_CONTAINED'));
            }
        });
    }

    private showToast(text: string): void {
        this.snackBar.open(text, '', {
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center'
        });
    }

    public deleteStartTrack(track: Track): void {
        let index: number = this.startTracks.indexOf(track);
        this.startTracks.splice(index, 1);
        this.radiostation.startTracks.splice(index, 1);
    }

    public setSelMood(pSelMood: Mood): void {
        this.radiostation.valence = pSelMood.valence;
        this.radiostation.arousal = pSelMood.arousal;
    }

    public canAddStartTracks(): boolean {
        if (this.startTracks) {
            return this.startTracks.length < Config.startTrackLimit;
        } else {
            return false;
        }
    }

}
