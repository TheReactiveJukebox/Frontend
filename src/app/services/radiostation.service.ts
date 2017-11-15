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
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';
import {HistoryService} from './history.service';
import {TrackService} from './track.service';


@Injectable()
export class RadiostationService implements OnDestroy {

    private subscriptions: Subscription[];
    private algorithms: BehaviorSubject<string[]>;
    private radiostationSubject: BehaviorSubject<Radiostation>;

    private radiostationApiUrl: string = Config.serverUrl + '/api/jukebox';  // URL to web api
    private historyApiUrl: string = Config.serverUrl + '/api/history';  // URL to web api
    private algorithmsApiUrl: string = Config.serverUrl + '/api/jukebox/algorithms';

    constructor(private trackService: TrackService,
                private authHttp: AuthHttp,
                private localHistory: HistoryService) {
        this.algorithms = new BehaviorSubject<string[]>([]);
        this.radiostationSubject = new BehaviorSubject<Radiostation>(null);
        this.subscriptions = [];
        this.fetchRadiostation();
        this.fetchAlgorithms();
    }

    ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    //starts a new radiostation with given creation criteria
    public startNewRadiostation(radiostation: Radiostation): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            console.log('Starting New Radiostation');

            this.authHttp.post(this.radiostationApiUrl, radiostation).subscribe((data: Radiostation) => {
                this.radiostationSubject.next(data);
                console.log('NEW RADIOSTATION: ', data);
                // reset local history, when a new radiostation is created. Do not reset history on update calls
                if (radiostation.id == null) {
                    this.localHistory.clearLocalHistory();
                }
                this.trackService.refreshTracks();
                observer.next(data);
                observer.complete();
            }, (error: any) => {
                if (error.status == 500 && error.statusText == 'OK') {
                    console.warn('WARNING: UGLY CATCH OF 500 Error in startNewRadiostation!!!');
                    this.radiostationSubject.next(JSON.parse(error._body));
                    // reset local history, when a new radiostation is created. Do not reset history on update calls
                    if (radiostation.id == null) {
                        this.localHistory.clearLocalHistory();
                    }
                    this.trackService.refreshTracks();
                    observer.next(error._body);
                    observer.complete();
                } else {
                    console.log('Creating new Radiostation failed!', error);
                    observer.error(error);
                }
            });
        });
    }

    //saves the song to the history by sending its id to the corresponding api endpoint
    public writeToHistory(track: Track): void {
        if (this.localHistory.history.length > 0 && this.localHistory.history.slice(-1)[0].id == track.id) {
            return;
        }
        this.localHistory.writeToLocalHistory(track);
        let reqBody = {
            trackId: track.id,
            radioId: this.getRadiostation().id
        };

        this.authHttp.post(this.historyApiUrl, reqBody).subscribe((data: any) => {
            track.historyId = data.id;
        }, (error: any) => {
            if (error.status == 500 && error.statusText == 'OK') {
                console.warn('WARNING: UGLY CATCH OF 500 Error in writeToHistory!!!');
                console.log('HISTORY RETURN DATA: ', JSON.parse(error._body));
                track.historyId = JSON.parse(error._body).id;
            } else {
                console.log('Writing "' + track.title + '" to history failed!', error);
            }
        });

    }

    public fetchRadiostation(): void {
        this.authHttp.get(this.radiostationApiUrl).subscribe((radiostation: Radiostation) => {
            this.radiostationSubject.next(radiostation);
        }, error => {
            if (error.status == 500 && error.statusText == 'OK') {
                console.warn('WARNING: UGLY CATCH OF 500 Error in fetchRadiostation!!!');
                this.radiostationSubject.next(JSON.parse(error._body));
            } else {
                console.log('Error fetching radiostation: ', error);
            }
        });
    }

    public updateRadiostation(radiostation: Radiostation): void {
        this.authHttp.post(this.radiostationApiUrl, radiostation).subscribe((newRadiostation: Radiostation) => {
            this.radiostationSubject.next(newRadiostation);
        }, error => {
            if (error.status == 500 && error.statusText == 'OK') {
                console.warn('WARNING: UGLY CATCH OF 500 Error in fetchRadiostation!!!');
                this.radiostationSubject.next(JSON.parse(error._body));
            } else {
                console.log('Error fetching radiostation: ', error);
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
            console.log('Error fetching algorithms: ', error);
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
        return this.algorithms.asObservable();
    }

    public refreshTrackList(): void {
        this.trackService.refreshTrackList();
    }

}
