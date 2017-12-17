import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from '../../models/track';
import {FeedbackService} from '../../services/feedback.service';
import {HistoryService} from '../../services/history.service';
import {TrackService} from '../../services/track.service';
import {Config} from '../../config';
import {GenreFeedback} from '../../models/genre-feedback';
import {Utils} from '../../utils';

@Component({
    selector: 'current-track',
    templateUrl: './current-track.component.html',
    styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent implements OnInit {

    @Input()
    public currentTrack: Track;

    @Input()
    public canCoverClick: boolean = false;

    @Input()
    public isCurrentTrack: boolean = false;

    @Output()
    public onCoverClick: EventEmitter<any> = new EventEmitter();

    constructor(public trackService: TrackService,
                public feedbackService: FeedbackService,
                public historyService: HistoryService) {
    }

    public ngOnInit(): void {

    }

    public getGenres(): GenreFeedback[] {
        let selectedGenres: GenreFeedback[] = this.currentTrack.genres.slice(0, Config.genreDisplayLimit);
        if (selectedGenres) {
            return selectedGenres;
        } else {
            return [];
        }
    }

    public round(value: number, digits?: number): number {
        return Utils.round(value, digits);
    }

    // TODO add timer to avoid multiple calls
    public onTrackFeedbackChanged(): void {
        this.feedbackService.postTrackFeedback(this.currentTrack);
    }

    public onGenreFeedbackChanged(): void {
        this.feedbackService.postGenreFeedback(this.currentTrack);
    }

    public onArtistFeedbackChanged(): void {
        this.feedbackService.postArtistFeedback(this.currentTrack);
    }

    public onAlbumFeedbackChanged(): void {
        this.feedbackService.postAlbumFeedback(this.currentTrack);
    }

    public capitalize(s: string): string {
        return Utils.capitalize(s);
    }

    public getTrackCover(): string {
        if (this.currentTrack.cover) {
            return this.currentTrack.cover;
        } else {
            return '../../../../assets/img/album_cover.png';
        }
    }
}
