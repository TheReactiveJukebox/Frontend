import {Album} from './album';
import {Artist} from './artist';
import {TrackFeedback} from './track-feedback';
import {Mood} from './mood';
import {GenreFeedback} from './genre-feedback';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MoodFeedback} from './mood-feedback';
import {SpeedFeedback} from './speed-feedback';

export class Track {
    public id: number;
    public title: string;
    public artist: Artist;
    public album: Album;
    public cover: string;
    public duration: number;
    public historyId: number;
    public speed: number;
    public genres: GenreFeedback[];
    public valence?: number;
    public arousal?: number;
    public mood?: Mood;
    public releaseDate?: Date;
    public feedback?: TrackFeedback;
    public moodFeedback: MoodFeedback;
    public speedFeedback: SpeedFeedback;
    public fMood: number;
    public fSpeed: number;

    public file: string;
    public data?: any;
    public downloadSub: Subscription;
    public xhrRequest: XMLHttpRequest;
    public readyToPlay: BehaviorSubject<boolean>;
    public brokenFile?: boolean;
}
