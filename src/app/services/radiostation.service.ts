/**
 * This service takes care of actions related to radiostations.
 */
import {Injectable, OnDestroy} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Subscription} from 'rxjs/Subscription';
import {TrackService} from './track.service';
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';
import {Config} from '../config';
import {Jukebox} from '../models/jukebox';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class RadiostationService implements OnDestroy {

    private subscriptions: Subscription[];
    public jukebox: Jukebox;
    private algorithms: BehaviorSubject<string[]>;

    private radiostationApiUrl = Config.serverUrl + '/api/jukebox';  // URL to web api
    private historyApiUrl = Config.serverUrl + '/api/history';  // URL to web api
    private algorithmsApiUrl = '/api/jukebox/algorithms';

    constructor(private trackService: TrackService,
                private authHttp: AuthHttp) {
        this.algorithms = new BehaviorSubject<string[]>([]);
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
    public startNewRadiostation(creationParameters: any): void {
        console.log('Starting New Radiostation');
        this.deleteRadiostation();

        this.authHttp.post(this.radiostationApiUrl, creationParameters).subscribe((data: Jukebox) => {
            this.jukebox = data;
            this.trackService.refreshTracks();
        }, (error: Response) => {
            if (error.status == 400) {
                console.log('The provided jukebox object is malformed');
            }
            console.log('Creating new Radiostation failed!', error);
        });
    }

    //deletes the current radiostation - currently not in use
    public deleteRadiostation(): void {
        this.jukebox = null;
    }

    //saves the song to the history by sending its id to the corresponding api endpoint
    public writeToHistory(track: Track): void {
        let reqBody = {
            trackId: track.id,
            radioId: this.jukebox.id
        };

        this.authHttp.post(this.historyApiUrl, reqBody).subscribe((data: any) => {
            console.log('HISTORY RETURN DATA: ', data);
        }, (error: Response) => {
            if (error.status == 400) {
                console.log('The provided history entry is malformed');
            }
            console.log('Writing "' + track.title + '" to history failed!', error);
        });

    }

    public fetchRadiostation(): void {
        this.authHttp.get(this.radiostationApiUrl).subscribe((jukebox: Jukebox) => {
            this.jukebox = jukebox;
        }, error => {
            console.log('Catched error: ', error);
        });
    }

    public fetchAlgorithms(): void {
        this.authHttp.get(this.algorithmsApiUrl).subscribe((algorithms: string[]) => {
            this.algorithms.next(algorithms);
            console.log('ALGORITHMS: ', algorithms);
        }, error => {
            console.log('Error fetching algorithms: ', error);
        });
    }

    public hasJukebox(): boolean {
        return this.jukebox != null;
    }

    public getAlgorithms(): Observable<string[]> {
        return this.algorithms.asObservable();
    }

}
