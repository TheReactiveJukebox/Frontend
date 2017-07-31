import {Component, Inject} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {Tendency} from '../../../models/tendency';
import {NgFor} from '@angular/common';

@Component({
    selector: 'tendency-feedback-dialog',
    templateUrl: 'tendency-feedback-dialog.component.html',
    styleUrls: ['./tendency-feedback-dialog.component.scss']
})
export class TendencyFeedbackDialogComponent {
    cTendency: Tendency;
    genres = [];
    selected = '';

    constructor(public dialogRef: MdDialogRef<TendencyFeedbackDialogComponent>) {

    }

    btnLessDynamics() {
        if (this.cTendency.lessDynamics) {
            this.cTendency.lessDynamics = false;
        } else {
            this.cTendency.moreDynamics = false;
            this.cTendency.lessDynamics = true;
        }
    }

    btnMoreDynamics() {
        if (this.cTendency.moreDynamics) {
            this.cTendency.moreDynamics = false;
        } else {
            this.cTendency.lessDynamics = false;
            this.cTendency.moreDynamics = true;
        }
    }

    btnSlower() {
        if (this.cTendency.slower) {
            this.cTendency.slower = false;
        } else {
            this.cTendency.faster = false;
            this.cTendency.slower = true;
        }
    }

    btnFaster() {
        if (this.cTendency.faster) {
            this.cTendency.faster = false;
        } else {
            this.cTendency.slower = false;
            this.cTendency.faster = true;
        }
    }


    btnOlder() {
        if (this.cTendency.startOlder) {
            this.cTendency.startOlder = false;
        } else {
            this.cTendency.startNewer = false;
            this.cTendency.startOlder = true;
        }
    }

    btnNewer() {
        if (this.cTendency.startNewer) {
            this.cTendency.startNewer = false;
        } else {
            this.cTendency.startOlder = false;
            this.cTendency.startNewer = true;
        }
    }

    confirmDialog() {

    }

    confirmAndApplyDialog() {

    }

    closeDialog() {

    }
}