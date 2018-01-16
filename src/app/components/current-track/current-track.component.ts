import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from '../../models/track';
import {FeedbackService} from '../../services/feedback.service';
import {HistoryService} from '../../services/history.service';
import {TrackService} from '../../services/track.service';
import {Config} from '../../config';
import {GenreFeedback} from '../../models/genre-feedback';
import {Utils} from '../../utils';
import {LoggingService} from '../../services/logging.service';

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
                private loggingService: LoggingService,
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

    public onTrackFeedbackChanged(): void {
        this.feedbackService.postTrackFeedback(this.currentTrack).subscribe(() => {
            this.trackService.updateTrackCache();
        }, error => {
            this.loggingService.error(this, 'Failed to post trackFeedback!', error);
        });
    }

    public onSpeedFeedbackChanged(): void {
        this.feedbackService.postSpeedFeedback(this.currentTrack).subscribe(() => {
            this.trackService.updateTrackCache();
        }, error => {
            this.loggingService.error(this, 'Failed to post speedFeedback!', error);
        });
    }

    public onMoodFeedbackChanged(): void {
        this.feedbackService.postMoodFeedback(this.currentTrack).subscribe(() => {
            this.trackService.updateTrackCache();
        }, error => {
            this.loggingService.error(this, 'Failed to post moodFeedback!', error);
        });
    }

    public onGenreFeedbackChanged(genre: GenreFeedback): void {
        this.feedbackService.postGenreFeedback(genre).subscribe(() => {
            this.trackService.updateTrackCache();
        }, error => {
            this.loggingService.error(this, 'Post genre feedback failed. Cant fetch new songs!');
        });
    }

    public onArtistFeedbackChanged(): void {
        this.feedbackService.postArtistFeedback(this.currentTrack).subscribe(() => {
            this.trackService.updateTrackCache();
        }, error => {
            this.loggingService.error(this, 'Post artist feedback failed. Cant fetch new songs!');
        });
    }

    public onAlbumFeedbackChanged(): void {
        this.feedbackService.postAlbumFeedback(this.currentTrack).subscribe(() => {
            this.trackService.updateTrackCache();
        }, error => {
            this.loggingService.error(this, 'Failed to post albumFeedback!', error);
        });
    }

    public capitalize(s: string): string {
        return Utils.capitalize(s);
    }

    public getTrackCover(): string {
        let coverUrls: string = '';
        if (this.currentTrack.cover) {
            coverUrls += 'url(' + this.currentTrack.cover + '), ';
        }
        coverUrls += 'url(../../../../assets/img/album_cover.png)';
        return coverUrls;
    }

}
