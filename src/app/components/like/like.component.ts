import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';
import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
    selector: 'like',
    templateUrl: './like.component.html',
    styleUrls: ['./like.component.scss'],
    animations: [
        trigger('likeState', [
            state('0', style({
                opacity: '.35',
                transform: 'scale(1)'
            })),
            state('1', style({
                opacity: '1',
                transform: 'scale(1.1)'
            })),
            transition('1 => 0', animate('200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')),
            transition('1 => -1', animate('200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')),
            transition('-1 => 1', animate('200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')),
            transition('0 => 1', animate('200ms cubic-bezier(0.6, -0.28, 0.735, 0.045)'))
        ]),
        trigger('dislikeState', [
            state('0', style({
                opacity: '.35',
                transform: 'scale(1)'
            })),
            state('-1', style({
                opacity: '1',
                transform: 'scale(1.1)'
            })),
            transition('-1 => 0', animate('200ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')),
            transition('1 => -1', animate('200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')),
            transition('-1 => 1', animate('200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')),
            transition('0 => -1', animate('200ms cubic-bezier(0.6, -0.28, 0.735, 0.045)'))
        ]),

    ]
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
            this.value = 0;
        } else {
            this.value = -1;
        }
        this.valueChange.emit(this.value);
    }

}
