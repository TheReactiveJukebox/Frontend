import { OnDestroy, Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import {TrackService} from './track.service';
import {Track} from '../models/track';
import {AuthHttp} from './auth/auth-http';
import {Config} from '../config';
import {Jukebox} from '../models/jukebox';
import {PlayerService} from './player.service';


@Injectable()
export class RadiostationService implements OnDestroy{

    public currentTrack: Track;
    private subscriptions: Subscription[];
    public jukebox: Jukebox;

    private radiostationApiUrl = Config.serverUrl + '/api/jukebox';  // URL to web api


    constructor(private trackService: TrackService,
                private playerService: PlayerService,
                private authHttp: AuthHttp) {
        this.subscriptions = [];

        this.trackService.refreshTracks();

        // subscribe to the currentTrack BehaviorSubject in trackService. If it get's changed, it will be automatically
        // set to our component. The Subscription returned by subscribe() is stored, to unsubscribe, when our component
        // gets destroyed.
        this.subscriptions.push(
            this.trackService.currentTrack.subscribe((currentTrack: Track) => {
                this.currentTrack = currentTrack;
            })
        );
    }

    ngOnDestroy(): void {
        // VERY IMPORTANT!!! Clean up, after this component is unused. Otherwise you will left lots of unused subscriptions,
        // which can cause heavy laggs.
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    public startNewRadiostation(creationParameters: any): void {
        console.log('Starting New Radiostation');
        this.deleteRadiostation();

        this.authHttp.post(this.radiostationApiUrl,creationParameters).subscribe((data: Jukebox) => {
            this.jukebox = data;
        }, (error: Response) => {
            if (error.status == 400) {
                console.log('The provided jukebox object is malformed');
            }
            console.log('Creating new Radiostation failed!', error);
        });

        this.trackService.refreshTracks();

        //TODO: Switch to radiostation view
    }

    public deleteRadiostation(): void {
        this.playerService.stop();
    }

}
