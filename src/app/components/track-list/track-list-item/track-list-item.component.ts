import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Track} from '../../../models/track';
import {FeedbackService} from '../../../services/feedback.service';
import {TrackService} from '../../../services/track.service';
import {HistoryService} from '../../../services/history.service';
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
        ]),
        trigger('sizeState', [
            state('void', style({
                width: '48px',
                height: '48px'
            })),
            state('1', style({
                width: '15%',
                height: '15%'
            })),
            transition('1 => void', animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')),
            transition('void => 1', animate('400ms cubic-bezier(0.6, -0.28, 0.735, 0.045)'))
        ]),
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

    @Input()
    public displayClass: string = 'upcomingTrack';

    @Output()
    public onDelete: EventEmitter<any>;

    @Output()
    public onCoverClick: EventEmitter<any>;

    @Output()
    public onClick: EventEmitter<any>;

    public showItem: boolean;
    public detailView: boolean = this.displayClass == 'currentTrack';

    public historyButtonClass: string = 'reducedHistory-button-toggle-off';

    constructor(public feedbackService: FeedbackService,
                public trackService: TrackService,
                public  historyService: HistoryService) {
        this.onDelete = new EventEmitter<any>();
        this.onCoverClick = new EventEmitter<any>();
        this.onClick = new EventEmitter<any>();
        this.showItem = true;

        //TODO: This doesn't work as expected
        this.detailView = this.displayClass == 'currentTrack';
        //this.detailView = true;
    }

    setDetailedView(state: boolean): void {
        this.detailView = state;
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

    public btn_history_toggle(): void {
        if (this.historyService.historyVisible) {
            this.historyService.historyVisible = false;
            this.historyButtonClass = 'history-button-toggle-off';
        } else {
            this.historyService.historyVisible = true;
            this.historyButtonClass = 'history-button-toggle-on';
        }
    }

    public btn_renew(): void {
        this.trackService.refreshUpcomingTracks();
    }

    public round(value: number, digits?: number): number {
        if (digits) {
            value *= Math.pow(10, digits);
            value = Math.round(value);
            value /= Math.pow(10, digits);
            return value;
        } else {
            return Math.round(value);
        }
    }

    // TODO add timer to avoid multiple calls
    public onTrackFeedbackChanged(): void {
        this.feedbackService.postTrackFeedback(this.track);
    }

    public onGenreFeedbackChanged(): void {
        this.feedbackService.postGenreFeedback(this.track);
    }

    public onArtistFeedbackChanged(): void {
        this.feedbackService.postArtistFeedback(this.track);
    }

    public onAlbumFeedbackChanged(): void {
        this.feedbackService.postAlbumFeedback(this.track);
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

    public capitalize(s: string): string {
        return s[0].toUpperCase() + s.slice(1);
    }

}
