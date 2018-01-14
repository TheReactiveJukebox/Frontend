/**
 * This service takes care of actions related to radiostations.
 */
import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';
import {Config} from '../config';
import {Radiostation} from '../models/radiostation';
import {AuthHttp} from './auth/auth-http';
import {TrackService} from './track.service';
import {LoggingService} from './logging.service';


@Injectable()
export class RadiostationService implements OnDestroy {

    private subscriptions: Subscription[];
    private algorithms: BehaviorSubject<string[]>;
    private radiostationSubject: BehaviorSubject<Radiostation>;

    private radiostationApiUrl: string = Config.serverUrl + '/api/jukebox';  // URL to web api
    private algorithmsApiUrl: string = Config.serverUrl + '/api/jukebox/algorithms';

    constructor(private trackService: TrackService,
                private loggingService: LoggingService,
                private authHttp: AuthHttp) {
        this.algorithms = new BehaviorSubject<string[]>([]);
        this.radiostationSubject = new BehaviorSubject<Radiostation>(null);
        this.subscriptions = [];
    }

    public ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    public init(): void {
        this.algorithms.next([]);
        this.radiostationSubject.next(null);
        this.subscriptions = [];
        this.fetchRadiostation();
        this.fetchAlgorithms();
    }

    //starts a new radiostation with given creation criteria
    public startNewRadiostation(radiostation: Radiostation): Observable<Radiostation> {
        return Observable.create((observer: Observer<any>) => {
            // set ids to null, to indicate server, that we want a new radiostation
            radiostation.userId = null;
            radiostation.id = null;
            this.authHttp.post(this.radiostationApiUrl, radiostation).subscribe((data: Radiostation) => {
                this.radiostationSubject.next(data);
                this.trackService.refreshCurrentAndUpcomingTracks(true);
                observer.next(data);
                observer.complete();
            }, (error: any) => {
                this.loggingService.error(this, 'Creating new Radiostation failed!', error);
                observer.error(error);
            });
        });
    }

    public updateRadiostation(radiostation: Radiostation): Observable<Radiostation> {
        return Observable.create((observer: Observer<any>) => {
            this.authHttp.post(this.radiostationApiUrl, radiostation).subscribe((data: Radiostation) => {
                this.radiostationSubject.next(data);
                this.trackService.refreshUpcomingTracks();
                observer.next(data);
                observer.complete();
            }, (error: any) => {
                this.loggingService.error(this, 'Updating Radiostation failed!', error);
                observer.error(error);
            });
        });
    }

    public fetchRadiostation(): void {
        this.authHttp.get(this.radiostationApiUrl).subscribe((radiostation: Radiostation) => {
            this.radiostationSubject.next(radiostation);
            this.trackService.refreshCurrentAndUpcomingTracks(false);
        }, error => {
            if (error.status == 404) {
                this.loggingService.log(this, 'Fetched radiostation, but there is no one available!');
            } else {
                this.loggingService.error(this, 'Error fetching radiostation!', error);
            }
        });
    }

    /*
     * Fetches available algortihms from server
     */
    private fetchAlgorithms(): void {
        this.authHttp.get(this.algorithmsApiUrl).subscribe((algorithms: string[]) => {
            this.algorithms.next(algorithms);
        }, error => {
            this.loggingService.error(this, 'Error fetching algorithms!', error);
        });
    }

    // TODO what should be done, if there is no current value?
    public faster(increment?: number): void {
        let radiostation: Radiostation = this.radiostationSubject.getValue();
        if (!increment) {
            increment = 10;
        }
        radiostation.minSpeed = radiostation.minSpeed + increment > Config.speedUpperLimit ?
                Config.speedUpperLimit : radiostation.minSpeed + increment;

        radiostation.maxSpeed = radiostation.maxSpeed + increment > Config.speedUpperLimit ?
            Config.speedUpperLimit : radiostation.maxSpeed + increment;

        this.updateRadiostation(radiostation).subscribe(null, error => {
            this.loggingService.error(this, 'Failed to call updateRadiostation!');
        });
    }

    // TODO what should be done, if there is no current value?
    public slower(decrement?: number): void {
        let radiostation: Radiostation = this.radiostationSubject.getValue();
        if (!decrement) {
            decrement = 10;
        }
        radiostation.minSpeed = radiostation.minSpeed - decrement < Config.speedLowerLimit ?
                Config.speedLowerLimit : radiostation.minSpeed - decrement;

        radiostation.maxSpeed = radiostation.maxSpeed - decrement < Config.speedLowerLimit ?
            Config.speedLowerLimit : radiostation.maxSpeed - decrement;
        this.updateRadiostation(radiostation).subscribe(null, error => {
            this.loggingService.error(this, 'Failed to call updateRadiostation!');
        });
    }

    public hasRadiostation(): boolean {
        return this.radiostationSubject.getValue() != null;
    }

    public getRadiostationSubject(): BehaviorSubject<Radiostation> {
        return this.radiostationSubject;
    }

    public getRadiostation(): Radiostation {
        return this.radiostationSubject.getValue();
    }

    public getAlgorithms(): Observable<string[]> {
        return this.algorithms;
    }

}
