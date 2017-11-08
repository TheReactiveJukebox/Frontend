import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Config} from 'app/config';
import {Tendency} from '../../../models/tendency';


@Component({
    selector: 'tendency-feedback-dialog',
    templateUrl: 'tendency-feedback-dialog.component.html',
    styleUrls: ['./tendency-feedback-dialog.component.scss']
})
export class TendencyFeedbackDialogComponent {
    cTendency: Tendency = new Tendency();

    speedUpperLimit = Config.speedUpperLimit;
    speedLowerLimit = Config.speedLowerLimit;
    speedStepsize = Config.speedStepsize;
    dynamicStepsize = Config.dynamicStepsize;
    yearStepsize = Config.yearStepsize;
    yearLowerLimit = Config.yearLowerLimit;
    yearUpperLimit = Config.yearUpperLimit;
    presetPeriodStart;
    presetPeriodEnd;
    presetDynamic;
    presetSpeed;

    constructor(public dialogRef: MdDialogRef<TendencyFeedbackDialogComponent>) {
    }

    setCurTendency(curTendency: Tendency): void {
        this.cTendency.radioId = curTendency.radioId;
        this.cTendency.preferredDynamics = curTendency.preferredDynamics;
        this.cTendency.preferredPeriodEnd = curTendency.preferredPeriodEnd;
        this.cTendency.preferredPeriodStart = curTendency.preferredPeriodStart;
        this.cTendency.preferredSpeed = curTendency.preferredSpeed;

    }

    public static roundAvoid(value: number, places: number): number {
        let scale = Math.pow(10, places);
        return Math.round(value * scale) / scale;
    }

    btnLessDynamics(): void {
        if (this.presetDynamic == null) {
            this.presetDynamic = this.cTendency.preferredDynamics;
        }
        if (this.cTendency.preferredDynamics > Config.dynamicStepsize) {
            let value = this.cTendency.preferredDynamics - Config.dynamicStepsize;
            this.cTendency.preferredDynamics = TendencyFeedbackDialogComponent.roundAvoid(value, 3);
        } else {
            this.cTendency.preferredDynamics = 0;
        }
    }

    btnMoreDynamics(): void {
        if (this.presetDynamic == null) {
            this.presetDynamic = this.cTendency.preferredDynamics;
        }
        if (this.cTendency.preferredDynamics < 1 - Config.dynamicStepsize) {
            let value = this.cTendency.preferredDynamics + Config.dynamicStepsize;
            this.cTendency.preferredDynamics = TendencyFeedbackDialogComponent.roundAvoid(value, 3);
        } else {
            this.cTendency.preferredDynamics = 1;
        }
    }

    onDynamicSliderChange(value): void {
        if (this.presetDynamic == null) {
            this.presetDynamic = this.cTendency.preferredDynamics;
        }
        this.cTendency.preferredDynamics = TendencyFeedbackDialogComponent.roundAvoid(value, 3);
    }

    btnSlower(): void {
        if (this.presetSpeed == null) {
            this.presetSpeed = this.cTendency.preferredSpeed;
        }
        if (this.cTendency.preferredSpeed > Config.speedStepsize + Config.speedLowerLimit) {
            this.cTendency.preferredSpeed = TendencyFeedbackDialogComponent.roundAvoid(
                this.cTendency.preferredSpeed - Config.speedStepsize, 0);
        } else {
            this.cTendency.preferredSpeed = Config.speedLowerLimit;
        }
    }

    btnFaster(): void {
        if (this.presetSpeed == null) {
            this.presetSpeed = this.cTendency.preferredSpeed;
        }
        if (this.cTendency.preferredSpeed < Config.speedUpperLimit - Config.speedStepsize) {
            this.cTendency.preferredSpeed = TendencyFeedbackDialogComponent.roundAvoid(
                this.cTendency.preferredSpeed + Config.speedStepsize, 0);
        } else {
            this.cTendency.preferredSpeed = Config.speedUpperLimit;
        }
    }

    onSpeedSliderChange(value): void {
        if (this.presetSpeed == null) {
            this.presetSpeed = this.cTendency.preferredSpeed;
        }
        this.cTendency.preferredSpeed = TendencyFeedbackDialogComponent.roundAvoid(value, 0);
    }

    btnStartOlder(): void {
        if (this.presetPeriodStart == null) {
            this.presetPeriodStart = this.cTendency.preferredPeriodStart;
        }
        if (this.cTendency.preferredPeriodStart > Config.yearLowerLimit + Config.yearStepsize) {
            this.cTendency.preferredPeriodStart = TendencyFeedbackDialogComponent.roundAvoid(
                this.cTendency.preferredPeriodStart - Config.yearStepsize, 0);
        } else {
            this.cTendency.preferredPeriodStart = Config.yearLowerLimit;
        }
    }


    btnStartNewer(): void {
        if (this.presetPeriodStart == null) {
            this.presetPeriodStart = this.cTendency.preferredPeriodStart;
        }
        if (this.cTendency.preferredPeriodStart < new Date().getFullYear() - Config.yearStepsize) {
            this.cTendency.preferredPeriodStart = TendencyFeedbackDialogComponent.roundAvoid(
                this.cTendency.preferredPeriodStart + Config.yearStepsize, 0);
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
        this.cTendency.preferredPeriodStart = TendencyFeedbackDialogComponent.roundAvoid(value, 0);
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
        if (this.cTendency.preferredPeriodEnd > Config.yearLowerLimit + Config.yearStepsize) {
            this.cTendency.preferredPeriodEnd = TendencyFeedbackDialogComponent.roundAvoid(
                this.cTendency.preferredPeriodEnd - Config.yearStepsize, 0);
        } else {
            this.cTendency.preferredPeriodEnd = Config.yearLowerLimit;
        }
        if (this.cTendency.preferredPeriodStart > this.cTendency.preferredPeriodEnd) {
            this.cTendency.preferredPeriodStart = this.cTendency.preferredPeriodEnd;
        }
    }

    btnEndNewer(): void {
        if (this.presetPeriodEnd == null) {
            this.presetPeriodEnd = this.cTendency.preferredPeriodEnd;
        }
        if (this.cTendency.preferredPeriodEnd < Config.yearUpperLimit - Config.yearStepsize) {
            this.cTendency.preferredPeriodEnd = TendencyFeedbackDialogComponent.roundAvoid(
                this.cTendency.preferredPeriodEnd + Config.yearStepsize, 0);
        } else {
            this.cTendency.preferredPeriodEnd = Config.yearUpperLimit;
        }
    }

    onPeriodEndSliderChange(value): void {
        if (this.presetPeriodEnd == null) {
            this.presetPeriodEnd = this.cTendency.preferredPeriodEnd;
        }
        this.cTendency.preferredPeriodEnd = TendencyFeedbackDialogComponent.roundAvoid(value, 0);
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
