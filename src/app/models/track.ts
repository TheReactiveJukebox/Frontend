import {Album} from './album';
import {Artist} from './artist';

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
    public genres: string[];
    public releaseDate?: Date;
}
