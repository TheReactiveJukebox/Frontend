import {Artist} from './artist';
import {AlbumFeedback} from './album-feedback';

export class Album {
    public id: number;
    public artist: Artist;
    public title: string;
    public feedback?: AlbumFeedback;
}
