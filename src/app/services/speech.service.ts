import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * webkitSpeechRecognition is still experimental and not covered by TypeScript definitions. To avoid TypeScript errors, declare it as
 * dummy-variable.
 */
declare var webkitSpeechRecognition: any;

@Injectable()
export class SpeechService {

    // webkitSpeechRecognition instance
    private recognition: any;

    // this BehaviorSubject indicates, if the machine is capturing the microphone input
    private listening: BehaviorSubject<boolean>;

    // indicates if the service is initialized
    private initialized: boolean;

    constructor(private zone: NgZone) {
        this.listening = new BehaviorSubject(false);
        // check, if wektiSpeechRecognition is available
        if (('webkitSpeechRecognition' in window)) {
            console.log('webkitSpeechRecognition is available!');
            this.recognition = new webkitSpeechRecognition();

            // false = when user stops talking, browser will stop listening
            // true = browser listens continuous
            // note: if you set this to 'true', you have to stop browser'a listening manually by calling recognition.stop()
            this.recognition.continuous = false;

            // false = result is returned, when the browser stops listening
            // true = permanent stream of interim results
            this.recognition.interimResults = false;

            // language spoken by user
            this.recognition.lang = 'de-DE';

            this.initialized = true;
        } else {
            //no webkitSpeechRecognition, we can't use SpeechRecognition
            console.log('webkitSpeechRecognition not available!');
            this.initialized = false;
        }
    }

    /**
     * Starts browser's speech recognition and translates spoken words to text using Web Speech Api.
     * @returns Observable<string> The sppech-tp-text result.
     */
    public recordSpeech(): Observable<string> {
        return Observable.create(observer => {
            if (this.initialized) {
                // At the beginning we define functions, which will be called by the speech api during recognition process

                // do this, when the speech recognition returns a result
                this.recognition.onresult = speech => {
                    let term: string = '';
                    if (speech.results) {
                        let result = speech.results[speech.resultIndex];
                        term = result[0].transcript;
                        // Every result has an confidence value. Results with low values are not reliable. In this case, we return an error!
                        if (result[0].confidence < 0.4) {
                            observer.error('Indistinguishable speech!');
                        }
                    }
                    this.zone.run(() => {
                        observer.next(term);
                    });
                };

                // do this, when the speech recognition fails
                this.recognition.onerror = error => {
                    observer.error(error);
                };

                // do this, after the speech recognition ends
                this.recognition.onend = () => {
                    observer.complete();
                    this.zone.run(() => {
                        this.listening.next(false);
                    });
                };

                // now start the recognition, from this moment on the browser will listen to computer's microphone
                this.recognition.start();
                this.listening.next(true);
            } else {
                observer.error('Service not initialized!');
            }
        });
    }

    public isListening(): Observable<boolean> {
        return this.listening.asObservable();
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

}
