import {Injectable} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {LoadingComponent} from '../components/loading/loading.component';

@Injectable()
export class LoadingService {

    private dialogRef: MdDialogRef<LoadingComponent>;

    constructor(private dialog: MdDialog) {}

    public show(): void {
        this.dialogRef = this.dialog.open(LoadingComponent, {
            width: '200px',
            height: '200px'
        });
    }

    public hide(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
            this.dialogRef = null;
        }
    }

}
