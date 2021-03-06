import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs/Subject';
import {PlayerService} from '../../services/player.service';
import {RadiostationService} from '../../services/radiostation.service';
import {SpeechService} from '../../services/speech.service';
import {LoggingService} from '../../services/logging.service';

@Component({
    selector: 'speech-search-field',
    styleUrls: ['./speech-search-field.component.scss'],
    templateUrl: './speech-search-field.component.html',
})
export class SpeechSearchFieldComponent implements OnInit, OnDestroy {

    @Output()
    public detectedText: string;
    @Output()
    public searchCall: EventEmitter<any> = new EventEmitter();

    @Input() public minimal: boolean = false;

    public listening: boolean;
    private ngUnsubscribe: Subject<void>;
    public micColor: any;
    private colorRunner: number;

    private controlTerms: Map<string, number>;

    constructor(public speechService: SpeechService,
                public playerService: PlayerService,
                private radiostationService: RadiostationService,
                private loggingService: LoggingService,
                private translateService: TranslateService) {
        this.detectedText = '';
        this.ngUnsubscribe = new Subject<void>();
        this.micColor = {'color': `rgba(255,255,255,1)`};
        this.animateColor();
    }

    public ngOnInit(): void {
        // subscribe to Listening Observable. When ever the browser starts or stops listening, this will be called
        this.speechService.isListening().takeUntil(this.ngUnsubscribe).subscribe((listening: boolean) => {
            this.listening = listening;
        });
        this.initializeControlTerms();
    }

    public ngOnDestroy(): void {
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
         1:  Play
         2:  Pause
         3:  Stop
         4:  Skip song
         5:  Louder
         6:  Quieter
         7:  Mute
         8:  UNUSED!
         9:  UNUSED!
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
        this.loggingService.log(this, 'Recognized speech: ' + speech);

        //Tokenization to find functional term in a sentence of recognized speech.
        let tokens: string[] = speech.toLocaleLowerCase().split(' ');
        let action: number = -1;
        let j = 0;
        for (let i of tokens) {
            if (this.controlTerms.has(i)) {
                action = this.controlTerms.get(i);
            }
            j++;
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
            case 10: {
                this.radiostationService.faster();
                break;
            }
            case 11: {
                this.radiostationService.slower();
                break;
            }
            case 12: {
                // TODO this.radiostationService.older();
                break;
            }
            case 13: {
                // TODO this.radiostationService.newer();
                break;
            }
            default: {
            }
        }
        this.searchCall.emit(speech);
    }

    public animateColor(): void {
        this.colorRunner = 255;
        const worker = () => {
            if (this.colorRunner < 255) {
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
