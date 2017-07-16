import {Component, EventEmitter, OnDestroy, OnInit, Output, Input} from '@angular/core';
import {SpeechService} from '../../services/speech.service';
import {Subject} from 'rxjs/Subject';
import {TranslateService} from '@ngx-translate/core';
import {PlayerService} from '../../services/player.service';





@Component({
    selector: 'speech-search-field',
    styleUrls: [ './speech-search-field.component.scss' ],
    templateUrl: './speech-search-field.component.html',
    providers: [PlayerService]
})
export class SpeechSearchFieldComponent implements OnInit, OnDestroy {


    @Output()
    public detectedText: string;
    @Output()
    searchCall = new EventEmitter();

    @Input() minimal:boolean = false;

    public listening: boolean;
    private ngUnsubscribe: Subject<void>;

    private controlTerms: Map<string,number>;


    constructor(public speechService: SpeechService,
                public playerService : PlayerService,
                private translateService: TranslateService
    ) {
        this.detectedText = '';
        this.ngUnsubscribe = new Subject<void>();
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
        if (this.listening)
            this.stop();
        else
            this.start();
    }

    // cancel speech-search-field recognition
    public stop(): void {
        this.speechService.stopListening();
    }

    // starts speech-search-field recognition and set it's result to detectedText
    public start(): void {
        this.speechService.recordSpeech().takeUntil(this.ngUnsubscribe).subscribe((text: string) => {
           this.detectedText = text;
           if(text.trim().length > 0){
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
        });
    }
    public test(event): void {
      console.log(event.target.value);
    }

    //Author: David Spain

    private initializeControlTerms(){
        this.controlTerms = new Map();
        /*
        Mapping of speech terms and synonyms to control function (incomplete functionality as of 16.07.2017)
        1: Play
        2: Pause
        3: Stop
        4: Skip song
         */
        this.controlTerms.set('abspielen',1);
        this.controlTerms.set('wiedergeben',1);
        this.controlTerms.set('play',1);
        this.controlTerms.set('continue',1);

        this.controlTerms.set('pause',2);
        this.controlTerms.set('pausieren',2);
        this.controlTerms.set('unterbrechen',2);

        this.controlTerms.set('stop',3);
        this.controlTerms.set('stopp',3);
        this.controlTerms.set('anhalten',3);

        this.controlTerms.set('skip',4);
        this.controlTerms.set('weiter',4);
        this.controlTerms.set('next',4);
        this.controlTerms.set('überspringen',4);
    }

    private handleSpeech(speech:string): void {
        console.log('Recognized speech: ', speech);

        let tokens:string[] = speech.toLocaleLowerCase().split(' ');
        let action:number = -1;

        for(let i of tokens){
            if(this.controlTerms.has(i)){
                action = this.controlTerms.get(i);
            }
        }

        switch (action){
            case 1:{

                console.log('Speech play');
                this.playerService.play();
                break;
            }
            case 2:{

                this.playerService.pause();
                break;
            }
            case 3:{

                this.playerService.stop();
                break;
            }
            case 4:{

                this.playerService.skipForward(false);
                break;
            }
            default:{

            }
        }
        this.searchCall.emit(speech);
    }

}
