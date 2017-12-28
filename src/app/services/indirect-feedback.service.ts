import {Injectable} from '@angular/core';
import {Config} from '../config';
import {IndirectFeedback} from '../models/indirect-feedback';
import {AuthHttp} from './auth/auth-http';
import {LoggingService} from './logging.service';

@Injectable()
export class IndirectFeedbackService {

    private indirectFeedbackURI: string = Config.serverUrl + '/api/track/indirect-feedback';

    constructor(private authHttp: AuthHttp,
                private loggingService: LoggingService) {}

    //HTTP post of the checked feedback object to API
    private postIndirectFeedback(body: IndirectFeedback): void {
        if (IndirectFeedbackService.checkBodySyntax(body)) {
            this.authHttp.post(this.indirectFeedbackURI, body).subscribe(
                () => {

                },
                error => {
                    if (error.status == 500 && error.statusText == 'OK') {
                        this.loggingService.warn(this, 'UGLY CATCH OF 500 Error in postIndirectFeedback!');
                    } else {
                        this.loggingService.error(this, 'Sending indirect feedback failed!', error);
                    }
                }
            );
        }
    }

    //Check that mirrors the backend check of the object that will be sent to the backend
    private static checkBodySyntax(body: IndirectFeedback): boolean {
        let numbercheck: boolean = (body.trackId > 0 && body.radioId > 0 && body.position >= 0);
        let namecheck: boolean = (body.feedbackName == 'SKIP' || body.feedbackName == 'DELETE'
            || body.feedbackName == 'MULTI_SKIP');
        let multicheck: boolean = !(body.feedbackName == 'MULTI_SKIP') || body.toTrackId > 0;
        return numbercheck && namecheck && multicheck;
    }

    public sendDeleteFeedback(trackID: number, radioID: number, position: number): void {
        let feedback: IndirectFeedback = new IndirectFeedback(radioID, trackID, position);
        feedback.makeDeleteFeedback();
        this.postIndirectFeedback(feedback);
    }

    public sendSkipFeedback(trackID: number, toTrackID: number , radioID: number, position: number): void {
        let feedback: IndirectFeedback = new IndirectFeedback(radioID, trackID, position, toTrackID);
        feedback.makeSkipFeedback();
        this.postIndirectFeedback(feedback);
    }

    public sendMultiSkipFeedback(trackID: number, toTrackID: number, radioID: number, position: number): void {
        let feedback: IndirectFeedback = new IndirectFeedback(radioID, trackID, position, toTrackID);
        feedback.makeMultiSkipFeedback();
        this.postIndirectFeedback(feedback);
    }
}
