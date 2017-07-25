import {Injectable} from '@angular/core';
import {Config} from '../config';
import {Subscription} from 'rxjs/Subscription';
import {IndirectFeedback} from '../models/indirectFeedback';
import {AuthHttp} from './auth/auth-http';
import {Track} from '../models/track';

@Injectable()

export class IndirectFeedbackService{

    private indirectFeedbackURI = Config.serverUrl + '/api/';


    constructor(private authHttp:AuthHttp){}

    private postIndirectFeedback(body:IndirectFeedback):void {
        if(this.checkBodySyntax(body)){
            this.authHttp.post(this.indirectFeedbackURI,body).subscribe(
                ()=>{console.log('Posting indirect feedback successful');},
                error => {
                    console.log('The API call produced a ' + error.status + ' error');
                }
            );
        }
    }

    private checkBodySyntax(body:IndirectFeedback):boolean{
        let numbercheck:boolean = (body.trackId > 0 && body.radioId > 0 && body.position >=0);
        let namecheck:boolean = (body.feedbackName == 'SKIP' || body.feedbackName == 'DELETE'
            || body.feedbackName == 'MULTI_SKIP');
        let multicheck = !(body.feedbackName == 'MULTI_SKIP') || body.toTrackId > 0;
        return numbercheck && namecheck && multicheck;
    }

    public sendDeleteFeedback(trackID:number, radioID:number, postition:number):void{
        let feedback:IndirectFeedback = new IndirectFeedback(radioID,trackID,postition);
        feedback.makeDeleteFeedback();
        this.postIndirectFeedback(feedback);
    }

    public sendSkipFeedback(trackID:number, radioID:number, postition:number):void{
        let feedback:IndirectFeedback = new IndirectFeedback(radioID,trackID,postition);
        feedback.makeSkipFeedback();
        this.postIndirectFeedback(feedback);
    }

    public sendMultiSkipFeedback(trackID:number, toTrackID:number, radioID:number, postition:number):void{
        let feedback:IndirectFeedback = new IndirectFeedback(radioID,trackID,postition,toTrackID);
        feedback.makeMultiSkipFeedback();
        this.postIndirectFeedback(feedback);
    }
}