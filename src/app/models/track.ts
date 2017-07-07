import {Artist} from './artist';

export class Track {
    id: number;
    title: string;
    artist: Artist;
    album: string;
    cover: string;
    duration: number;
    file: string;
    data?: any;
}
