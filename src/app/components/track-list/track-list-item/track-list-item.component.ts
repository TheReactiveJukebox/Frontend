import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Track} from '../../../models/track';
import {FeedbackService} from '../../../services/feedback.service';
import {Config} from '../../../config';

@Component({
    selector: 'track-list-item',
    templateUrl: './track-list-item.component.html',
    styleUrls: ['./track-list-item.component.scss'],
    animations: [
        trigger('expand', [
            state('true', style({'height': '*'})),
            state('void', style({'height': '0px'})),
            transition('void => *', animate('0.5s ease-out')),
            transition('* => void', animate('0.5s ease-out'))
        ])
    ]
})
export class TrackListItemComponent {

    @Input()
    public track: Track;

    @Input()
    public showFeedback: boolean = true;

    @Input()
    public showDelete: boolean = true;

    @Input()
    public showPlay: boolean = true;

    @Output()
    public onDelete: EventEmitter<any>;

    @Output()
    public onCoverClick: EventEmitter<any>;

    public showItem: boolean;

    constructor(public feedbackService: FeedbackService) {
        this.onDelete = new EventEmitter<any>();
        this.onCoverClick = new EventEmitter<any>();
        this.showItem = true;
    }

    public btn_like(): void {
        this.feedbackService.postTrackFeedback(this.track);
    }

    public hideItem(): void {
        this.showItem = false;
    }

    public getTrackCover(): string {
        if (this.track.cover) {
            return this.track.cover;
        } else {
            return '../../../../assets/img/album_cover.png';
        }
    }

    public getGenres(): string {
        let genres: string = '';
        let slicedArray = this.track.genres.slice(0, Config.genreDisplayLimit);
        if (slicedArray) {
            for (let genre of slicedArray) {
                let genreStr: string = this.capitalize(genre.genre);
                genres += genreStr + ', ';
            }
            genres = genres.substr(0, genres.length - 2);
        }
        return genres;
    }

    public  capitalize(s: string): string {
        return s[0].toUpperCase() + s.slice(1);
    }

}
