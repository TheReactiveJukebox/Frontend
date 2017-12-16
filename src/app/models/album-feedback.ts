/**
 * Model class for a track feedback
 */
export class AlbumFeedback {
    public album: number = -1;
    public feedback: number = 0;

    constructor(data?: any) {
        if (data) {
            this.album = data.album;
            this.feedback = data.feedback;
        }
    }
}
