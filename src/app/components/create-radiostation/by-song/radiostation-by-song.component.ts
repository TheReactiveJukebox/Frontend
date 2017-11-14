import {Component, EventEmitter, Output} from '@angular/core';
import {Radiostation} from '../../../models/radiostation';
import {Track} from '../../../models/track';
import {PlayerService} from '../../../services/player.service';
import {RadiostationService} from '../../../services/radiostation.service';

@Component({
    selector: 'my-radiostation-by-song',
    templateUrl: './radiostation-by-song.component.html',
    styleUrls: ['./radiostation-by-song.component.scss']

})
export class RadiostationBySongComponent {

    tracks: Track[];
    algorithms: string[];

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();

    public radiostation: Radiostation;

    constructor(public radiostationService: RadiostationService,
                public playerService: PlayerService) {
        this.radiostationService.getAlgorithms().subscribe((algorithms: string[]) => {
            this.algorithms = algorithms;
        });
        this.reset();
    }

    reset(): void {
        this.tracks = [];
        this.radiostation = new Radiostation();
        this.radiostation.algorithm = 'SAGH';
    }

    public deleteSelection(value: Track): void {
        this.tracks.splice(this.tracks.indexOf(value), 1);
        this.radiostation.startTracks.splice(this.radiostation.startTracks.indexOf(value.id), 1);
    }

    public start(): void {
        this.radiostationService.startNewRadiostation(this.radiostation).subscribe(() => {
            this.playerService.play();
            this.onStart.emit();
        });
    }

    public addStartTrack(track: Track): void {
        if (this.tracks.indexOf(track) == -1) {
            if (this.tracks.length == 5) {
                this.tracks.splice(0, 1);
                this.radiostation.startTracks.splice(0, 1);
            }
            this.tracks.push(track);
            this.radiostation.startTracks.push(track.id);
        }
    }

    public getSearchHeight(): number {
        let count: number = Math.min(5, this.tracks.length);
        return 32 + 58 + 20 + (56 * count);
    }
}
