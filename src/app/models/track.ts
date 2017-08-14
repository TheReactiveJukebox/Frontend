import {Album} from './album';
import {Artist} from './artist';

export class Track {
    id: number;
    title: string;
    artist: Artist;
    album: Album;
    cover: string;
    duration: number;
    file: string;
    data?: any;
    historyId: number;
    speed: number;
    period: number;
    dynamic: number;
    genre: string;
    releaseDate: Date;
}
