import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {SpeechService} from '../../services/speech.service';
import {Subject} from 'rxjs/Subject';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'speech-search-field',
    styleUrls: [ './speech-search-field.component.scss' ],
    templateUrl: './speech-search-field.component.html'
})
export class SpeechComponent implements OnInit, OnDestroy {

    @Output()
    public detectedText: string;

    public listening: boolean;
    private ngUnsubscribe: Subject<void>;

    constructor(public speechService: SpeechService,
                private translateService: TranslateService) {
        this.detectedText = '';
        this.ngUnsubscribe = new Subject<void>();
    }

    ngOnInit(): void {
        // subscribe to Listening Observable. When ever the browser starts or stops listening, this will be called
        this.speechService.isListening().takeUntil(this.ngUnsubscribe).subscribe((listening: boolean) => {
            this.listening = listening;
        });
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

}
