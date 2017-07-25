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
        if(!this.checkBodySyntax(body)) return;

        this.authHttp.post(this.indirectFeedbackURI,body).subscribe(
            ()=>{console.log('Posting indirect feedback successful');},
            error => {
                console.log('The API call produced a ' + error.status + ' error');
            }
            );
    }

    private checkBodySyntax(body:IndirectFeedback):boolean{
        return false;
    }
}