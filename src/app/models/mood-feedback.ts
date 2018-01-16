/**
 * Model class for a mood feedback
 */
export class MoodFeedback {
    public fMood: number = null;
    public feedback: number = 0;

    constructor(data?: any) {
        if (data) {
            this.fMood = data.fMood;
            this.feedback = data.feedback;
        }
    }
}
