import {Component, Input} from '@angular/core';

@Component({
    selector: 'page-title',
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {

    @Input()
    public height: number = 40;

    constructor() {

    }

}
