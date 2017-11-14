import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
    selector: 'add-constraint-dialog',
    templateUrl: 'add-constraint-dialog.component.html',
})

export class AddConstraintDialogComponent {

    constructor(public dialogRef: MdDialogRef<AddConstraintDialogComponent>) {

    }
}
