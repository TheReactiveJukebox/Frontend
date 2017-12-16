import {Album} from './album';
import {Artist} from './artist';
import {TrackFeedback} from './track-feedback';
import {Mood} from './mood';
import {GenreFeedback} from './genre-feedback';

export class Track {
    public id: number;
    public title: string;
    public artist: Artist;
    public album: Album;
    public cover: string;
    public duration: number;
    public file: string;
    public data?: any;
    public historyId: number;
    public speed: number;
    public dynamic: number;
    public genres: GenreFeedback[];
    public valence?: number;
    public arousal?: number;
    public mood?: Mood;
    public releaseDate?: Date;
    public trackFeedback?: TrackFeedback;
}
