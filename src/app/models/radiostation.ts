export class Radiostation {
    id: number;
    userId: number;
    mood: string;
    startTracks: number[];
    algorithm: string;
    startYear: number;
    endYear: number;
    speed: number;
    dynamic: number;
    genres: string[];

    constructor() {
        this.id = -1;
        this.userId = -1;
        this.genres = [];
        this.mood = null;
        this.startTracks = [];
        this.algorithm = null;
        this.startYear = null;
        this.endYear = null;
        this.speed = null;
        this.dynamic = null;
    }
}
