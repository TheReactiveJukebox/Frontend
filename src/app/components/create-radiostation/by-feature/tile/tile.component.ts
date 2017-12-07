import {Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
    selector: 'tile',
    styleUrls: ['./tile.component.scss'],
    templateUrl: './tile.component.html',
    animations: [
        trigger('expand', [
            state('true', style({'opacity': '1.0'})),
            state('void', style({'opacity': '0.0'})),
            transition('void => *', animate('0.3s ease-out')),
            transition('* => void', animate('0.3s ease-out'))
        ])
    ]
})
export class TileComponent {

    @Input()
    public label: string;

    @Input()
    public showContent: boolean = false;

    @Output()
    public onDelete: EventEmitter<any> = new EventEmitter();

    @Output()
    public onAdd: EventEmitter<any> = new EventEmitter();

    constructor() {

    }

}
