import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'like',
    templateUrl: './like.component.html',
    styleUrls: ['./like.component.scss']
})
export class LikeComponent {

    @Input()
    public value: number;

    @Output()
    public valueChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {

    }

    public like(): void {
        if (this.value == 1) {
            this.value = 0;
            this.valueChange.emit(this.value);
        } else {
            this.value = 1;
        }
        this.valueChange.emit(this.value);
    }

    public dislike(): void {
        if (this.value == -1) {
            this.value =  0;
        } else {
            this.value = -1;
        }
        this.valueChange.emit(this.value);
    }

}
