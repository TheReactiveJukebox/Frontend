import {Component, OnInit} from '@angular/core';
import {SpeechService} from '../../services/speech.service';

@Component({
    selector: 'speech',
    styleUrls: [ './speech.component.scss' ],
    templateUrl: './speech.component.html'
})
export class SpeechComponent implements OnInit {

    public detectedText: string;

    public listening: boolean;

    constructor(public speechService: SpeechService) {
        this.detectedText = '';
    }

    ngOnInit(): void {

        // subscribe to Listening Observable. When ever the browser starts or stops listening, this will be called
        this.speechService.isListening().subscribe((listening: boolean) => {
            this.listening = listening;
        });
    }

    // starts speech recognition and set it's result to detectedText
    public start(): void {
        this.speechService.recordSpeech().subscribe((text: string) => {
           this.detectedText = text;
        }, error => {
            console.log('Error: ', error);
        });
    }

}
