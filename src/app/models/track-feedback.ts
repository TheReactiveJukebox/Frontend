/**
 * Model class for a track feedback
 */
export class TrackFeedback {
    id: number = -1;
    userId: number = -1;
    radioId: number = -1;
    trackId: number = -1;
    songFeedback: number = 0;
    artistFeedback: number = 0;
    speedFeedback: number = 0;
    genreFeedback: number = 0;
    dynamicsFeedback: number = 0;
    moodFeedback: number = 0;

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
