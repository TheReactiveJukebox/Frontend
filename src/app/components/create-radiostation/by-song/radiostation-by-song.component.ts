import {Component, EventEmitter, Output} from '@angular/core';
import {Track} from '../../../models/track';
import {PlayerService} from '../../../services/player.service';
import {RadiostationService} from '../../../services/radiostation.service';

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

    tracks: Track[];
    algorithms: string[];

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();

    constructor(public radiostationService: RadiostationService,
                public playerService: PlayerService) {
        this.radiostationService.getAlgorithms().subscribe((algorithms: string[]) => {
            this.algorithms = algorithms;
        });
        this.tracks = [];
    }

    reset(): void {
        this.tracks = [];
    }

    public deleteSelection(value: Track): void {
        this.tracks.splice(this.tracks.indexOf(value), 1);
        this.creationParameters.startTracks.splice(this.creationParameters.startTracks.indexOf(value.id), 1);
    }

    public start(): void {
        this.radiostationService.startNewRadiostation(this.creationParameters);
        this.playerService.play();
        this.onStart.emit();
    }

    public addStartTrack(track: Track): void {
        if (this.tracks.indexOf(track) == -1) {
            if (this.tracks.length == 5) {
                this.tracks.splice(0, 1);
                this.creationParameters.startTracks.splice(0, 1);
            }
            this.tracks.push(track);
            this.creationParameters.startTracks.push(track.id);
        }
    }

    public getSearchHeight(): number {
        let count: number = Math.min(5, this.tracks.length);
        return 32 + 58 + 20 + (56 * count);
    }
}
