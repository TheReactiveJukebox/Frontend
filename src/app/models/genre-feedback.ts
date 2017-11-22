/**
 * Model class for a track feedback
 */
export class GenreFeedback {
    public genre: string = null;
    public feedback: number = 0;

    constructor(data?: any) {
        if (data) {
            this.genre = data.genre;
            this.feedback = data.feedback;
        }
    }
}
