import {Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Track} from '../../../../models/track';


@Component({
    selector: 'start-track',
    templateUrl: './start-track.component.html',
    styleUrls: ['./start-track.component.scss'],
    animations: [
        trigger('expand', [
            state('true', style({'height': '*'})),
            state('void', style({'height': '0px'})),
            transition('void => *', animate('0.5s ease-out')),
            transition('* => void', animate('0.5s ease-out'))
        ])
    ]
})
export class StartTrackComponent {

    @Input()
    public track: Track;

    @Output()
    public onDelete: EventEmitter<any>;

    public showItem: boolean;

    constructor() {
        this.onDelete = new EventEmitter<any>();
        this.showItem = true;
    }

    public hideItem(): void {
        this.showItem = false;
    }

    public getTrackCover(): string {
        let coverUrls: string = '';
        if (this.track.cover) {
            coverUrls += 'url(' + this.track.cover + '), ';
        }
        coverUrls += 'url(../../../../assets/img/album_cover.png)';
        return coverUrls;
    }

}
