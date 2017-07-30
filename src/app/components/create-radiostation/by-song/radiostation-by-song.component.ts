import {Component, EventEmitter, Output} from '@angular/core';
import {RadiostationService} from '../../../services/radiostation.service';
import {PlayerService} from '../../../services/player.service';
import {Track} from '../../../models/track';

@Component({
    selector: 'my-radiostation-by-song',
    templateUrl: './radiostation-by-song.component.html',
    styleUrls: ['./radiostation-by-song.component.scss']

})
export class RadiostationBySongComponent {

    creationParameters: {
        startTracks?: number[],
        algorithm?: string
    } = {
        algorithm: '',
        startTracks: []
    };

    track: Track;
    algorithms: string[];

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();

    constructor(public radiostationService: RadiostationService,
                public playerService: PlayerService) {
        this.radiostationService.getAlgorithms().subscribe((algorithms: string[]) => {
            this.algorithms = algorithms;
        });
    }

    reset() {
        this.track = null;
    }

    public start(): void {
        this.radiostationService.startNewRadiostation(this.creationParameters);
        this.playerService.play();
        this.onStart.emit();
    }

    public addStartTrack(track: Track): void {
        this.track = track;
        this.creationParameters.startTracks = [track.id];
    }

    public getSearchHeight(): number {
        if (this.track) {
            return 32 + 58 + 20 + 56;
        } else {
            return 32 + 58 + 20;
        }
    }
}