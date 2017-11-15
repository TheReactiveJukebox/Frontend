/**
 * Model class for a track feedback
 */
export class TrackFeedback {
    public id: number = -1;
    public userId: number = -1;
    public radioId: number = -1;
    public trackId: number = -1;
    public songFeedback: number = 0;
    public artistFeedback: number = 0;
    public speedFeedback: number = 0;
    public genreFeedback: {genre: string, feedback: number}[];
    public dynamicsFeedback: number = 0;
    public moodFeedback: number = 0;

    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.userId = data.userId;
            this.radioId = data.radioId;
            this.trackId = data.trackId;
            this.songFeedback = data.songFeedback;
            this.artistFeedback = data.artistFeedback;
            this.speedFeedback = data.speedFeedback;
            this.genreFeedback = data.genreFeedback;
            this.dynamicsFeedback = data.dynamicsFeedback;
            this.moodFeedback = data.moodFeedback;
        }
    }
}
