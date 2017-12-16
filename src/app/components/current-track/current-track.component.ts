import {Component, Input, OnInit} from '@angular/core';
import {Track} from '../../models/track';
import {FeedbackService} from '../../services/feedback.service';
import {HistoryService} from '../../services/history.service';
import {TrackService} from '../../services/track.service';
import {Config} from '../../config';
import {GenreFeedback} from '../../models/genre-feedback';

@Component({
    selector: 'current-track',
    templateUrl: './current-track.component.html',
    styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent implements OnInit {

    @Input()
    public currentTrack: Track;

    public btnVisible: boolean = false;
    public historyButtonClass: string = 'reducedHistory-button-toggle-off';

    constructor(public trackService: TrackService,
                public feedbackService: FeedbackService,
                public historyService: HistoryService) {
    }

    public ngOnInit(): void {

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

    public getGenres(): GenreFeedback[] {
        let selectedGenres: GenreFeedback[] = this.currentTrack.genres.slice(0, Config.genreDisplayLimit);
        if (selectedGenres) {
            return selectedGenres;
        } else {
            return [];
        }
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

    public  capitalize(s: string): string {
        return s[0].toUpperCase() + s.slice(1);
    }
}
