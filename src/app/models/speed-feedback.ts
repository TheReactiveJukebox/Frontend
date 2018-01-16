/**
 * Model class for a speed feedback
 */
export class SpeedFeedback {
    public fSpeed: number = null;
    public feedback: number = 0;

    constructor(data?: any) {
        if (data) {
            this.fSpeed = data.fSpeed;
            this.feedback = data.feedback;
        }
    }
}
