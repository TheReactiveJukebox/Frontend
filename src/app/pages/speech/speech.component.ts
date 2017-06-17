import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpeechService} from '../../services/speech.service';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'speech',
    styleUrls: [ './speech.component.scss' ],
    templateUrl: './speech.component.html'
})
export class SpeechComponent implements OnInit, OnDestroy {

    public detectedText: string;
    public listening: boolean;
    private ngUnsubscribe: Subject<void>;

    constructor(public speechService: SpeechService) {
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

    // toggles speech recognition listening state
    public toggleListening(): void {
        if (this.listening)
            this.stop();
        else
            this.start();
    }

    // cancel speech recognition
    public stop(): void {
        this.speechService.stopListening();
    }

    // starts speech recognition and set it's result to detectedText
    public start(): void {
        this.speechService.recordSpeech().takeUntil(this.ngUnsubscribe).subscribe((text: string) => {
           this.detectedText = text;
        }, error => {
            console.log('Error: ', error);
        });
    }

}
