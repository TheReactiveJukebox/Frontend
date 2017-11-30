/**
 * Model class for a track feedback
 */
export class TrackFeedback {
    public id: number = -1;
    public userId: number = -1;
    public trackId: number = -1;
    public songFeedback: number = 0;
    public speedFeedback: number = 0;
    public dynamicsFeedback: number = 0;
    public moodFeedback: number = 0;

    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.userId = data.userId;
            this.trackId = data.trackId;
            this.songFeedback = data.songFeedback;
            this.speedFeedback = data.speedFeedback;
            this.dynamicsFeedback = data.dynamicsFeedback;
            this.moodFeedback = data.moodFeedback;
        }
    }
}
