/**
 * Model class for a track feedback
 */
export class ArtistFeedback {
    public artist: number = -1;
    public feedback: number = 0;

    constructor(data?: any) {
        if (data) {
            this.artist = data.artist;
            this.feedback = data.feedback;
        }
    }
}
