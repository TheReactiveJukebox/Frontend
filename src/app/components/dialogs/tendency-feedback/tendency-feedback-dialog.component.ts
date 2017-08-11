import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Tendency} from '../../../models/tendency';

@Component({
    selector: 'tendency-feedback-dialog',
    templateUrl: 'tendency-feedback-dialog.component.html',
    styleUrls: ['./tendency-feedback-dialog.component.scss']
})
export class TendencyFeedbackDialogComponent {
    cTendency: Tendency;
    genres = [];

    speedUpperlimit = 400;
    speedLowerLimit = 1;
    speedStepsize = 5;
    dynamicStepsize = 0.1;
    yearStepsize = 5;
    yearLowerLimit = 1800;
    yearUpperLimit = new Date().getFullYear();

    presetPeriodStart;
    presetPeriodEnd;
    presetDynamic;
    presetSpeed;

    constructor(public dialogRef: MdDialogRef<TendencyFeedbackDialogComponent>) {
    }

    setCurTendency(curTendency: Tendency): void {
        this.cTendency = new Tendency();
        this.cTendency.radioId = curTendency.radioId;
        this.cTendency.preferredDynamics = curTendency.preferredDynamics;
        this.cTendency.preferredPeriodEnd = curTendency.preferredPeriodEnd;
        this.cTendency.preferredPeriodStart = curTendency.preferredPeriodStart;
        this.cTendency.preferredSpeed = curTendency.preferredSpeed;

    }

    roundAvoid(value: number, places: number): number {
        let scale = Math.pow(10, places);
        return Math.round(value * scale) / scale;
    }

    btnLessDynamics(): void {
        if (this.presetDynamic == null) {
            this.presetDynamic = this.cTendency.preferredDynamics;
        }
        if (this.cTendency.preferredDynamics > this.dynamicStepsize) {
            let value = this.cTendency.preferredDynamics - this.dynamicStepsize;
            this.cTendency.preferredDynamics = this.roundAvoid(value, 3);
        } else {
            this.cTendency.preferredDynamics = 0;
        }
    }

    btnMoreDynamics(): void {
        if (this.presetDynamic == null) {
            this.presetDynamic = this.cTendency.preferredDynamics;
        }
        if (this.cTendency.preferredDynamics < 1 - this.dynamicStepsize) {
            let value = this.cTendency.preferredDynamics + this.dynamicStepsize;
            this.cTendency.preferredDynamics = this.roundAvoid(value, 3);
        } else {
            this.cTendency.preferredDynamics = 1;
        }
    }

    onDynamicSliderChange(value): void {
        if (this.presetDynamic == null) {
            this.presetDynamic = this.cTendency.preferredDynamics;
        }
        this.cTendency.preferredDynamics = this.roundAvoid(value, 3);
    }

    btnSlower(): void {
        if (this.presetSpeed == null) {
            this.presetSpeed = this.cTendency.preferredSpeed;
        }
        if (this.cTendency.preferredSpeed > this.speedStepsize + this.speedLowerLimit) {
            this.cTendency.preferredSpeed = this.roundAvoid(this.cTendency.preferredSpeed - this.speedStepsize, 0);
        } else {
            this.cTendency.preferredSpeed = this.speedLowerLimit;
        }
    }

    btnFaster(): void {
        if (this.presetSpeed == null) {
            this.presetSpeed = this.cTendency.preferredSpeed;
        }
        if (this.cTendency.preferredSpeed < this.speedUpperlimit - this.speedStepsize) {
            this.cTendency.preferredSpeed = this.roundAvoid(this.cTendency.preferredSpeed + this.speedStepsize, 0);
        } else {
            this.cTendency.preferredSpeed = this.speedUpperlimit;
        }
    }

    onSpeedSliderChange(value): void {
        if (this.presetSpeed == null) {
            this.presetSpeed = this.cTendency.preferredSpeed;
        }
        this.cTendency.preferredSpeed = this.roundAvoid(value, 0);
    }

    btnStartOlder(): void {
        if (this.presetPeriodStart == null) {
            this.presetPeriodStart = this.cTendency.preferredPeriodStart;
        }
        if (this.cTendency.preferredPeriodStart > this.yearLowerLimit + this.yearStepsize) {
            this.cTendency.preferredPeriodStart = this.roundAvoid(this.cTendency.preferredPeriodStart - this.yearStepsize, 0);
        } else {
            this.cTendency.preferredPeriodStart = this.yearLowerLimit;
        }
    }

    btnStartNewer(): void {
        if (this.presetPeriodStart == null) {
            this.presetPeriodStart = this.cTendency.preferredPeriodStart;
        }
        if (this.cTendency.preferredPeriodStart < new Date().getFullYear() - this.yearStepsize) {
            this.cTendency.preferredPeriodStart = this.roundAvoid(this.cTendency.preferredPeriodStart + this.yearStepsize, 0);
        } else {
            this.cTendency.preferredPeriodStart = new Date().getFullYear();
        }
        if (this.cTendency.preferredPeriodStart > this.cTendency.preferredPeriodEnd) {
            this.cTendency.preferredPeriodEnd = this.cTendency.preferredPeriodStart;
        }
    }

    onPeriodStartSliderChange(value): void {
        if (this.presetPeriodStart == null) {
            this.presetPeriodStart = this.cTendency.preferredPeriodStart;
        }
        this.cTendency.preferredPeriodStart = this.roundAvoid(value, 0);
        if (this.cTendency.preferredPeriodStart > this.cTendency.preferredPeriodEnd) {
            if (this.presetPeriodEnd == null) {
                this.presetPeriodEnd = this.cTendency.preferredPeriodEnd;
            }
            this.cTendency.preferredPeriodEnd = this.cTendency.preferredPeriodStart;
        }
    }

    btnEndOlder(): void {
        if (this.presetPeriodEnd == null) {
            this.presetPeriodEnd = this.cTendency.preferredPeriodEnd;
        }
        if (this.cTendency.preferredPeriodEnd > this.yearLowerLimit + this.yearStepsize) {
            this.cTendency.preferredPeriodEnd = this.roundAvoid(this.cTendency.preferredPeriodEnd - this.yearStepsize, 0);
        } else {
            this.cTendency.preferredPeriodEnd = this.yearLowerLimit;
        }
        if (this.cTendency.preferredPeriodStart > this.cTendency.preferredPeriodEnd) {
            this.cTendency.preferredPeriodStart = this.cTendency.preferredPeriodEnd;
        }
    }

    btnEndNewer(): void {
        if (this.presetPeriodEnd == null) {
            this.presetPeriodEnd = this.cTendency.preferredPeriodEnd;
        }
        if (this.cTendency.preferredPeriodEnd < this.yearUpperLimit - this.yearStepsize) {
            this.cTendency.preferredPeriodEnd = this.roundAvoid(this.cTendency.preferredPeriodEnd + this.yearStepsize, 0);
        } else {
            this.cTendency.preferredPeriodEnd = this.yearUpperLimit;
        }
    }

    onPeriodEndSliderChange(value): void {
        if (this.presetPeriodEnd == null) {
            this.presetPeriodEnd = this.cTendency.preferredPeriodEnd;
        }
        this.cTendency.preferredPeriodEnd = this.roundAvoid(value, 0);
        if (this.cTendency.preferredPeriodStart > this.cTendency.preferredPeriodEnd) {
            if (this.presetPeriodStart == null) {
                this.presetPeriodStart = this.cTendency.preferredPeriodStart;
            }
            this.cTendency.preferredPeriodStart = this.cTendency.preferredPeriodEnd;
        }
    }

    confirmDialog(): void {
        this.cTendency.moreDynamics = this.presetDynamic < this.cTendency.preferredDynamics;
        this.cTendency.lessDynamics = this.presetDynamic > this.cTendency.preferredDynamics;
        this.cTendency.slower = this.presetSpeed > this.cTendency.preferredSpeed;
        this.cTendency.faster = this.presetSpeed < this.cTendency.preferredSpeed;
        this.cTendency.startOlder = this.presetPeriodStart > this.cTendency.preferredPeriodStart;
        this.cTendency.endOlder = this.presetPeriodEnd > this.cTendency.preferredPeriodEnd;
        this.cTendency.startNewer = this.presetPeriodStart < this.cTendency.preferredPeriodStart;
        this.cTendency.endNewer = this.presetPeriodEnd < this.cTendency.preferredPeriodEnd;
    }

    confirmAndApplyDialog(): void {
        this.confirmDialog();

    }

    closeDialog(): void {

    }
}
