import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'welcome',
    styleUrls: ['welcome.component.scss'],
    templateUrl: 'welcome.component.html',
})
export class WelcomeComponent {

    @Output()
    public onStart: EventEmitter<any> = new EventEmitter();

    constructor() {

    }
}
