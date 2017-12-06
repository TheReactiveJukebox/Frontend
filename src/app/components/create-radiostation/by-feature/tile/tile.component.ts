import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
    selector: 'tile',
    styleUrls: ['./tile.component.scss'],
    templateUrl: './tile.component.html',
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
