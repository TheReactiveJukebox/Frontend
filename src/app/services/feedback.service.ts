/**
 * This service takes care of feedback
 */
import {Injectable} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {SpecialFeedbackDialogComponent} from '../components/dialogs/special-feedback/special-feedback-dialog.component';
import {TendencyFeedbackDialogComponent} from '../components/dialogs/tendency-feedback/tendency-feedback-dialog.component';
import {Config} from '../config';
import {Tendency} from '../models/tendency';
import {Track} from '../models/track';
import {TrackFeedback} from '../models/track-feedback';
import {AuthHttp} from './auth/auth-http';
import {HistoryService} from './history.service';
import {RadiostationService} from './radiostation.service';

@Injectable()
export class FeedbackService {

    private feedbackUrl = Config.serverUrl + '/api/track/feedback';  // URL to web api
    private tendencyUrl = Config.serverUrl + '/api/jukebox/tendency';  // URL to web api

    private dialogRef: MdDialogRef<any>;
    private curTendency: Tendency = null;
    private curHistory: Track[];

    constructor(public radiostationService: RadiostationService,
                private localHistory: HistoryService,
                public dialog: MdDialog,
                private authHttp: AuthHttp) {}

    /**
     * Creates a TrackFeedback object which is matching to the given track and the current radio
     * @param track
     * @returns {TrackFeedback}
     */
    public createTrackFeedbackToTrack(track: Track): TrackFeedback {
        let feedback = new TrackFeedback();
        if (track != null) {
            feedback.trackId = track.id;
        }
        feedback.radioId = this.radiostationService.getJukebox().id;
        return feedback;
    }

    /**
     * Creates a Tendency object for the current radio
     * @returns {Tendency}
     */
    public createTendencyToCurrentRadio(): Tendency {
        //if there is no current tendency object => create one
        if (this.curTendency == null) {
            this.initTendency();
        } else if (this.localHistory.history.length < 1 && this.curTendency.radioId != this.radiostationService.getJukebox().id) {
            this.initTendency();  //if a new Radiostation was started
        } else {
            //if the history isn't identically with current (song written or deleted) => create new tendency object
            for (let i = 0; i < this.localHistory.history.length; i++) {
                if (this.curHistory.indexOf(this.localHistory.history[i]) == -1) {
                    //the history differs => build new tendency
                    this.initTendency();
                    break;
                }
            }
        }
        // remember the history of the last created tendency object is based on
        this.curHistory = [];
        for (let i = 0; i < this.localHistory.history.length; i++) {
            this.curHistory.push(this.localHistory.history[i]);
        }
        return this.curTendency;
    }


    private initTendency(): void {
        this.curTendency = new Tendency();
        this.curTendency.radioId = this.radiostationService.getJukebox().id;
        //calculate mean values
        this.curTendency.preferredDynamics = TendencyFeedbackDialogComponent.roundAvoid(this.localHistory.getMeanDynamic(), 2);
        this.curTendency.preferredSpeed = TendencyFeedbackDialogComponent.roundAvoid(this.localHistory.getMeanSpeed(), 0);
        this.curTendency.preferredPeriodStart = this.localHistory.getMinYear();
        this.curTendency.preferredPeriodEnd = this.localHistory.getMaxYear();
    }

    public setCurTendency(cTendency: Tendency): void {
        this.curTendency = cTendency;
    }


    public dislikeSong(feedback: TrackFeedback): TrackFeedback {
        feedback.songDisliked = true;
        if (feedback.songLiked) {
            //We don't know if the user likes the song
            feedback.songLiked = null;
        }
        return feedback;
    }

    public likeSong(feedback: TrackFeedback): TrackFeedback {
        feedback.songLiked = true;
        if (feedback.songDisliked) {
            //We don't know if the user dislikes the song
            feedback.songDisliked = null;
        }
        return feedback;
    }

    public dislikeArtist(feedback: TrackFeedback): TrackFeedback {
        feedback.artistDisliked = true;
        if (feedback.artistLiked) {
            //We don't know if the user likes the artist
            feedback.artistLiked = null;
        }
        return feedback;
    }

    public likeArtist(feedback: TrackFeedback): TrackFeedback {
        feedback.artistLiked = true;
        if (feedback.artistDisliked) {
            //We don't know if the user dislikes the artist
            feedback.artistDisliked = null;
        }
        return feedback;
    }

    public dislikeSpeed(feedback: TrackFeedback): TrackFeedback {
        feedback.speedDisliked = true;
        if (feedback.speedLiked) {
            //We don't know if the user likes the speed
            feedback.speedLiked = null;
        }
        return feedback;
    }

    public likeSpeed(feedback: TrackFeedback): TrackFeedback {
        feedback.speedLiked = true;
        if (feedback.speedDisliked) {
            //We don't know if the user dislikes the speed
            feedback.speedDisliked = null;
        }
        return feedback;
    }

    public dislikeGenre(feedback: TrackFeedback): TrackFeedback {
        feedback.genreDisliked = true;
        if (feedback.genreLiked) {
            //We don't know if the user likes the genre
            feedback.genreLiked = null;
        }
        return feedback;
    }

    public likeGenre(feedback: TrackFeedback): TrackFeedback {
        feedback.genreLiked = true;
        if (feedback.genreDisliked) {
            //We don't know if the user dislikes the genre
            feedback.genreDisliked = null;
        }
        return feedback;
    }

    public dislikeDynamics(feedback: TrackFeedback): TrackFeedback {
        feedback.dynamicsDisliked = true;
        if (feedback.dynamicsLiked) {
            //We don't know if the user likes the dynamics
            feedback.dynamicsLiked = null;
        }
        return feedback;
    }

    public likeDynamics(feedback: TrackFeedback): TrackFeedback {
        feedback.dynamicsLiked = true;
        if (feedback.dynamicsDisliked) {
            //We don't know if the user dislikes the dynamics
            feedback.dynamicsDisliked = null;
        }
        return feedback;
    }

    public dislikePeriod(feedback: TrackFeedback): TrackFeedback {
        feedback.periodDisliked = true;
        if (feedback.periodLiked) {
            //We don't know if the user likes the period
            feedback.periodLiked = null;
        }
        return feedback;
    }

    public likePeriod(feedback: TrackFeedback): TrackFeedback {
        feedback.periodLiked = true;
        if (feedback.periodDisliked) {
            //We don't know if the user dislikes the period
            feedback.periodDisliked = null;
        }
        return feedback;
    }

    public dislikeMood(feedback: TrackFeedback): TrackFeedback {
        feedback.moodDisliked = true;
        if (feedback.moodLiked) {
            //We don't know if the user likes the mood
            feedback.moodLiked = null;
        }
        return feedback;
    }

    public likeMood(feedback: TrackFeedback): TrackFeedback {
        feedback.moodLiked = true;
        if (feedback.moodDisliked) {
            //We don't know if the user dislikes the mood
            feedback.moodDisliked = null;
        }
        return feedback;
    }

    public postTrackFeedback(feedback: TrackFeedback): void {
        if (this.isTrackFeedbackValid(feedback)) {
            this.authHttp.post(this.feedbackUrl, feedback).subscribe((data: any) => {
            }, (error: Response) => {
                if (error.status == 500 && error.statusText == 'OK') {
                    console.warn('WARNING: UGLY CATCH OF 500 Error in postTrackFeedback!!!');
                } else {
                    console.warn('Sending feedback failed: ', error);
                }
            });

        }
    }

    public postTendency(tendency: Tendency): void {
        if (this.isTendencyValid(tendency)) {
            this.authHttp.post(this.tendencyUrl, tendency).subscribe((data: any) => {

            }, (error: Response) => {
                if (error.status == 500 && error.statusText == 'OK') {
                    console.warn('WARNING: UGLY CATCH OF 500 Error in postTendency!!!');
                } else {
                    console.warn('Sending feedback failed: ', error);
                }
            });

        }
    }

    /**
     * Posts a simple feedback containing radiostationID, songID, and a like or dislike for the given track to the backend
     * @param track track to give feedback to
     * @param like is the track liked? If false, the track will be disliked
     */
    public postSimpleFeedback(track: Track, like: boolean) {
        let feedback = this.createTrackFeedbackToTrack(track);
        if (like) {
            feedback = this.likeSong(feedback);
        } else {
            feedback = this.dislikeSong(feedback);
        }
        this.postTrackFeedback(feedback);
    }

    private isTrackFeedbackValid(feedback: TrackFeedback): boolean {

        return (feedback.radioId != null && feedback.trackId != null && (
        feedback.songLiked ||
        feedback.songDisliked ||
        feedback.artistLiked ||
        feedback.artistDisliked ||
        feedback.speedLiked ||
        feedback.speedDisliked ||
        feedback.genreLiked ||
        feedback.genreDisliked ||
        feedback.dynamicsLiked ||
        feedback.dynamicsDisliked ||
        feedback.periodLiked ||
        feedback.periodDisliked ||
        feedback.moodLiked ||
        feedback.moodDisliked));
    }

    private isTendencyValid(tendency: Tendency): boolean {

        return (tendency.radioId != null);
    }

    public openTrackFeedbackDialog(track: Track): void {
        this.dialogRef = this.dialog.open(SpecialFeedbackDialogComponent);
        this.dialogRef.componentInstance.cTrack = track;
        this.dialogRef.componentInstance.cFeedback = this.createTrackFeedbackToTrack(track);
        this.dialogRef.afterClosed().subscribe((result: string) => {
            if (result == '1' || result == '2') {
                this.postTrackFeedback(this.dialogRef.componentInstance.cFeedback);
                if (result == '2') {
                    this.radiostationService.refreshTrackList();
                }
            }
            this.dialogRef = null;

        });
    }

    public openTendencyFeedbackDialog(): void {
        this.dialogRef = this.dialog.open(TendencyFeedbackDialogComponent);
        this.dialogRef.componentInstance.setCurTendency(this.createTendencyToCurrentRadio());

        this.dialogRef.afterClosed().subscribe((result: string) => {
            if (result == '1' || result == '2') {
                this.postTendency(this.dialogRef.componentInstance.cTendency);
                this.curTendency = this.dialogRef.componentInstance.cTendency;
                if (result == '2') {
                    this.radiostationService.refreshTrackList();
                }
            }

            this.dialogRef = null;
        });
    }

    public moreDynamic(): void {
        //calculate new Tendency
        let cTendency: Tendency = this.createTendencyToCurrentRadio();
        if (cTendency.preferredDynamics < 1 - Config.dynamicStepsize) {
            let value = cTendency.preferredDynamics + Config.dynamicStepsize;
            cTendency.preferredDynamics = this.roundAvoid(value, 3);
        } else {
            cTendency.preferredDynamics = 1;
        }
        //send new Tendency
        this.setCurTendency(cTendency);
        this.postTendency(cTendency);
        this.radiostationService.refreshTrackList();
    }

    public lessDynamic(): void {
        //calculate new Tendency
        let cTendency: Tendency = this.createTendencyToCurrentRadio();
        if (cTendency.preferredDynamics > Config.dynamicStepsize) {
            let value = cTendency.preferredDynamics - Config.dynamicStepsize;
            cTendency.preferredDynamics = this.roundAvoid(value, 3);
        } else {
            cTendency.preferredDynamics = 0;
        }
        //send new Tendency
        this.setCurTendency(cTendency);
        this.postTendency(cTendency);
        this.radiostationService.refreshTrackList();
    }

    public faster(): void {
        //calculate new Tendency
        let cTendency: Tendency = this.createTendencyToCurrentRadio();
        if (cTendency.preferredSpeed < Config.speedUpperLimit - Config.speedStepsize) {
            cTendency.preferredSpeed = this.roundAvoid(cTendency.preferredSpeed + Config.speedStepsize, 0);
        } else {
            cTendency.preferredSpeed = Config.speedUpperLimit;
        }
        //send new Tendency
        this.setCurTendency(cTendency);
        this.postTendency(cTendency);
        this.radiostationService.refreshTrackList();
    }

    public slower(): void {
        //calculate new Tendency
        let cTendency: Tendency = this.createTendencyToCurrentRadio();
        if (cTendency.preferredSpeed > Config.speedStepsize + Config.speedLowerLimit) {
            cTendency.preferredSpeed = this.roundAvoid(cTendency.preferredSpeed - Config.speedStepsize, 0);
        } else {
            cTendency.preferredSpeed = Config.speedLowerLimit;
        }
        //send new Tendency
        this.setCurTendency(cTendency);
        this.postTendency(cTendency);
        this.radiostationService.refreshTrackList();
    }

    public older(): void {
        //set periodStart older
        let cTendency: Tendency = this.createTendencyToCurrentRadio();
        if (cTendency.preferredPeriodStart > Config.yearLowerLimit + Config.yearStepsize) {
            cTendency.preferredPeriodStart = this.roundAvoid(cTendency.preferredPeriodStart - Config.yearStepsize, 0);
        } else {
            cTendency.preferredPeriodStart = Config.yearLowerLimit;
        }
        //set periodEnd older
        if (cTendency.preferredPeriodEnd > Config.yearLowerLimit + Config.yearStepsize) {
            cTendency.preferredPeriodEnd = this.roundAvoid(cTendency.preferredPeriodEnd - Config.yearStepsize, 0);
        } else {
            cTendency.preferredPeriodEnd = Config.yearLowerLimit;
        }
        if (cTendency.preferredPeriodStart > cTendency.preferredPeriodEnd) {
            cTendency.preferredPeriodStart = cTendency.preferredPeriodEnd;
        }
        //send new Tendency
        this.setCurTendency(cTendency);
        this.postTendency(cTendency);
        this.radiostationService.refreshTrackList();
    }

    public newer(): void {
        //set periodStart newer
        let cTendency: Tendency = this.createTendencyToCurrentRadio();
        if (cTendency.preferredPeriodStart < new Date().getFullYear() - Config.yearStepsize) {
            cTendency.preferredPeriodStart = this.roundAvoid(cTendency.preferredPeriodStart + Config.yearStepsize, 0);
        } else {
            cTendency.preferredPeriodStart = new Date().getFullYear();
        }
        if (cTendency.preferredPeriodStart > cTendency.preferredPeriodEnd) {
            cTendency.preferredPeriodEnd = cTendency.preferredPeriodStart;
        }
        //set periodEnd newer
        if (cTendency.preferredPeriodEnd < Config.yearUpperLimit - Config.yearStepsize) {
            cTendency.preferredPeriodEnd = this.roundAvoid(cTendency.preferredPeriodEnd + Config.yearStepsize, 0);
        } else {
            cTendency.preferredPeriodEnd = Config.yearUpperLimit;
        }
        //send new Tendency
        this.setCurTendency(cTendency);
        this.postTendency(cTendency);
        this.radiostationService.refreshTrackList();
    }

    public moreOfGenre(genre: string): void {
        let cTendency: Tendency = this.createTendencyToCurrentRadio();
        console.log('genre recognised: ' + genre);
        //send new Tendency
        this.setCurTendency(cTendency);
        this.postTendency(cTendency);
        this.radiostationService.refreshTrackList();
    }

    roundAvoid(value: number, places: number): number {
        let scale = Math.pow(10, places);
        return Math.round(value * scale) / scale;
    }
}
