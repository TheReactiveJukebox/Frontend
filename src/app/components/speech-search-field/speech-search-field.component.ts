import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FeedbackService} from '../../services/feedback.service';
import {PlayerService} from '../../services/player.service';
import {SpeechService} from '../../services/speech.service';
import {Subject} from 'rxjs/Subject';
import {Tendency} from '../../models/tendency';
import {TranslateService} from '@ngx-translate/core';
import {Config} from '../../config';

@Component({
    selector: 'speech-search-field',
    styleUrls: ['./speech-search-field.component.scss'],
    templateUrl: './speech-search-field.component.html',
})
export class SpeechSearchFieldComponent implements OnInit, OnDestroy {


    @Output()
    public detectedText: string;
    @Output()
    searchCall = new EventEmitter();

    @Input() minimal: boolean = false;

    public listening: boolean;
    private ngUnsubscribe: Subject<void>;
    public micColor;
    private colorRunner;
    //private beep;

    private controlTerms: Map<string, number>;


    constructor(public speechService: SpeechService,
                public playerService: PlayerService,
                private translateService: TranslateService,
                private feedbackService: FeedbackService,) {
        this.detectedText = '';
        this.ngUnsubscribe = new Subject<void>();
        this.micColor = {'color': `rgba(255,255,255,1)`};
        this.animateColor();
        //this.beep = new Audio();
        //this.beep.src = 'http://www.soundjay.com/button/beep-03.wav';
        //this.beep.load();
    }

    ngOnInit(): void {
        // subscribe to Listening Observable. When ever the browser starts or stops listening, this will be called
        this.speechService.isListening().takeUntil(this.ngUnsubscribe).subscribe((listening: boolean) => {
            this.listening = listening;
        });
        this.initializeControlTerms();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    // toggles speech-search-field recognition listening state
    public toggleListening(): void {
        if (this.listening) {
            this.stop();
        } else {
            this.start();
        }
    }

    // cancel speech-search-field recognition
    public stop(): void {
        this.speechService.stopListening();
    }

    // starts speech-search-field recognition and set it's result to detectedText
    public start(): void {
        this.speechService.recordSpeech().takeUntil(this.ngUnsubscribe).subscribe((text: string) => {
            this.detectedText = text;
            if (text.trim().length > 0) {
                this.handleSpeech(text);
            }
        }, error => {
            if (error == 'Indistinguishable speech!') {
                this.detectedText = this.translateService.instant('SPEECH.ERROR.INDISTINGUISHABLE_SPEECH');
            } else if (error == 'Service not initialized!') {
                this.detectedText = this.translateService.instant('SPEECH.ERROR.NOT_AVAILABLE');
            } else {
                this.detectedText = this.translateService.instant('SPEECH.ERROR.GENERAL_ERROR');
            }

            if (this.minimal) {
                this.colorRunner = 0;
                //this.beep.play();
            }
        });
    }

    //Author: David Spain

    private initializeControlTerms(): void {
        this.controlTerms = new Map();
        /*
         Mapping of speech terms and synonyms to control function (incomplete functionality as of 15.08.2017)
         1: Play
         2: Pause
         3: Stop
         4: Skip song
         5: Louder
         6: Quieter
         7: Mute
         8: Dynamischer
         9: Undynamischer
         10: Faster
         11: Slower
         12: Older
         13: Newer
         */
        this.controlTerms.set('abspielen', 1);
        this.controlTerms.set('wiedergeben', 1);
        this.controlTerms.set('wiedergabe', 1);
        this.controlTerms.set('play', 1);
        this.controlTerms.set('continue', 1);

        this.controlTerms.set('pause', 2);
        this.controlTerms.set('pausieren', 2);
        this.controlTerms.set('unterbrechen', 2);

        this.controlTerms.set('stop', 3);
        this.controlTerms.set('stopp', 3);
        this.controlTerms.set('anhalten', 3);

        this.controlTerms.set('skip', 4);
        this.controlTerms.set('weiter', 4);
        this.controlTerms.set('next', 4);
        this.controlTerms.set('überspringen', 4);

        this.controlTerms.set('lauter', 5);
        this.controlTerms.set('louder', 5);

        this.controlTerms.set('leiser', 6);
        this.controlTerms.set('quieter', 6);

        this.controlTerms.set('mute', 7);
        this.controlTerms.set('stumm', 7);

        this.controlTerms.set('dynamischer', 8);
        this.controlTerms.set('more dynamic', 8);

        this.controlTerms.set('undynamischer', 9);
        this.controlTerms.set('less dynamic', 9);

        this.controlTerms.set('schneller', 10);
        this.controlTerms.set('faster', 10);

        this.controlTerms.set('langsamer', 11);
        this.controlTerms.set('slower', 11);

        this.controlTerms.set('older', 12);
        this.controlTerms.set('älter', 12);

        this.controlTerms.set('newer', 13);
        this.controlTerms.set('neuer', 13);
    }

    //Function to handle incoming speech. If no recognized term is in speech query the term will be send to the search bar
    private handleSpeech(speech: string): void {
        console.log('Recognized speech: ', speech);

        //Tokenization to find functional term in a sentence of recognized speech.
        let tokens: string[] = speech.toLocaleLowerCase().split(' ');
        let action: number = -1;

        for (let i of tokens) {
            if (this.controlTerms.has(i)) {
                action = this.controlTerms.get(i);
            }
        }

        switch (action) {
            case 1: {
                this.playerService.play();
                break;
            }
            case 2: {

                this.playerService.pause();
                break;
            }
            case 3: {

                this.playerService.stop();
                break;
            }
            case 4: {

                this.playerService.skipForward(false);
                break;
            }
            case 5: {
                let current: number = this.playerService.volume;
                current = current + 0.2;
                if (current > 1) {
                    current = 1;
                }
                this.playerService.setVolume(current);
                break;
            }
            case 6: {
                let current: number = this.playerService.volume;
                current = current - 0.2;
                if (current < 0) {
                    current = 0;
                }
                this.playerService.setVolume(current);
                break;
            }
            case 7: {
                this.playerService.volumeOff();
                break;
            }
            case 8: {
                //calculate new Tendency
                let cTendency: Tendency = this.feedbackService.createTendencyToCurrentRadio();
                if (cTendency.preferredDynamics < 1 - Config.dynamicStepsize) {
                    let value = cTendency.preferredDynamics + Config.dynamicStepsize;
                    cTendency.preferredDynamics = this.roundAvoid(value, 3);
                } else {
                    cTendency.preferredDynamics = 1;
                }
                //send new Tendency
                this.feedbackService.setCurTendency(cTendency);
                this.feedbackService.postTendency(cTendency);
                this.feedbackService.radiostationService.refreshTrackList();
                break;
            }
            case 9: {
                //calculate new Tendency
                let cTendency: Tendency = this.feedbackService.createTendencyToCurrentRadio();
                if (cTendency.preferredDynamics > Config.dynamicStepsize) {
                    let value = cTendency.preferredDynamics - Config.dynamicStepsize;
                    cTendency.preferredDynamics = this.roundAvoid(value, 3);
                } else {
                    cTendency.preferredDynamics = 0;
                }
                //send new Tendency
                this.feedbackService.setCurTendency(cTendency);
                this.feedbackService.postTendency(cTendency);
                this.feedbackService.radiostationService.refreshTrackList();
                break;
            }
            case 10: {
                //calculate new Tendency
                let cTendency: Tendency = this.feedbackService.createTendencyToCurrentRadio();
                if (cTendency.preferredSpeed < Config.speedUpperLimit - Config.speedStepsize) {
                    cTendency.preferredSpeed = this.roundAvoid(cTendency.preferredSpeed + Config.speedStepsize, 0);
                } else {
                    cTendency.preferredSpeed = Config.speedUpperLimit;
                }
                //send new Tendency
                this.feedbackService.setCurTendency(cTendency);
                this.feedbackService.postTendency(cTendency);
                this.feedbackService.radiostationService.refreshTrackList();
                break;
            }
            case 11: {
                //calculate new Tendency
                let cTendency: Tendency = this.feedbackService.createTendencyToCurrentRadio();
                if (cTendency.preferredSpeed > Config.speedStepsize + Config.speedLowerLimit) {
                    cTendency.preferredSpeed = this.roundAvoid(cTendency.preferredSpeed - Config.speedStepsize, 0);
                } else {
                    cTendency.preferredSpeed = Config.speedLowerLimit;
                }
                //send new Tendency
                this.feedbackService.setCurTendency(cTendency);
                this.feedbackService.postTendency(cTendency);
                this.feedbackService.radiostationService.refreshTrackList();
                break;
            }

            case 12: {
                //set periodStart older
                let cTendency: Tendency = this.feedbackService.createTendencyToCurrentRadio();
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
                this.feedbackService.setCurTendency(cTendency);
                this.feedbackService.postTendency(cTendency);
                this.feedbackService.radiostationService.refreshTrackList();
                break;
            }
            case 13: {
                //set periodStart newer
                let cTendency: Tendency = this.feedbackService.createTendencyToCurrentRadio();
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
                this.feedbackService.setCurTendency(cTendency);
                this.feedbackService.postTendency(cTendency);
                this.feedbackService.radiostationService.refreshTrackList();

                break;
            }
            default: {
            }
        }
        this.searchCall.emit(speech);
    }

    roundAvoid(value: number, places: number): number {
        let scale = Math.pow(10, places);
        return Math.round(value * scale) / scale;
    }

    public animateColor(): void {
        console.log('Animate');
        this.colorRunner = 255;
        const worker = () => {
            if (this.colorRunner < 255) {
                console.log('Color ' + this.colorRunner);
                this.micColor = {'color': `rgba(255,${this.colorRunner},${this.colorRunner},1)`};
                this.colorRunner = this.colorRunner + 5;
                requestAnimationFrame(worker);
            } else {
                this.micColor = {'color': `rgba(255,255,255,1)`};
                requestAnimationFrame(worker);
            }
        };
        worker();
    };

}
