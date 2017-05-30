import { Injectable } from '@angular/core';
import { Title } from '../models/title';

const MOCK_TITLES: Title[] = [
    { id: 1, title: 'Kryptonite', artist: '3 Doors Down', album: 'The Better Life - Deluxe Edition', duration: 233 },
    { id: 2, title: 'Hells Bells', artist: 'AC/DC', album: 'Back in Black', duration: 312 },
    { id: 3, title: 'Paint it Black', artist: 'The Rolling Stones', album: 'Singles 1965-1967', duration: 224 },
    { id: 4, title: 'Wonderwall', artist: 'Oasis', album: '[What\'s the Story] Morning Glory?', duration: 258 },
    { id: 5, title: 'Evil Ways', artist: 'Santana', album: 'Santana (Legacy Edition)', duration: 238 },
    { id: 6, title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Greatest Hits', duration: 355 },
    { id: 7, title: 'Come As You Are', artist: 'Nirvana', album: 'Nevermind (Deluxe Edition)', duration: 218 },
    { id: 8, title: 'Bodies', artist: 'Drowning Pool', album: 'Sinner', duration: 201 },
    { id: 9, title: 'Crocodile Rock', artist: 'Elton John', album: 'Don\'t Shooot Me I\'m Only The Piano Player', duration: 235 },
    { id: 10, title: 'I Was Made For Loving You', artist: 'KISS', album: 'Dynasty (Remastered Version)', duration: 217 },
    { id: 11, title: 'Come Out and Play', artist: 'The Offspring', album: 'Smash', duration: 197 },
    { id: 11, title: 'Rock & Roll Queen', artist: 'The Subways', album: 'Young For Eternity', duration: 169 },
];

@Injectable()
export class TitleService {
    getTitles(): Promise<Title[]> {
        return Promise.resolve(MOCK_TITLES);
    }
}
