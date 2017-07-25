import {Injectable} from '@angular/core';
import {Config} from '../config';
import {Subscription} from 'rxjs/Subscription';
import {IndirectFeedback} from '../models/indirectFeedback';
import {AuthHttp} from './auth/auth-http';
import {Track} from '../models/track';

@Injectable()

export class IndirectFeedbackService{

    private indirectFeedbackURI = Config.serverUrl + '';

    constructor(private authHttp:AuthHttp){}

}