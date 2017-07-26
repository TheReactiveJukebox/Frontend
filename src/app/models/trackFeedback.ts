/**
 * Model class for a track feedback
 */
export class TrackFeedback {
    id: number;
    userId: number;
    radioId: number;
    trackId: number;
    songLiked?: boolean;
    songDisliked?: boolean;
    artistLiked?: boolean;
    artistDisliked?: boolean;
    speedLiked?: boolean;
    speedDisliked?: boolean;
    genreLiked?: boolean;
    genreDisliked?: boolean;
    dynamicsLiked?: boolean;
    dynamicsDisliked?: boolean;
    periodLiked?: boolean;
    periodDisliked?: boolean;
    moodLiked?: boolean;
    moodDisliked?: boolean;
}
