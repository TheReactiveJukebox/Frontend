export class Radiostation {

    public id: number;
    public userId: number;
    public startTracks: number[];
    public algorithm: string;
    public startYear: number;
    public endYear: number;
    public minSpeed: number;
    public maxSpeed: number;
    public dynamic: number;
    public genres: string[];
    public arousal: number;
    public valence: number;

    constructor() {
        this.id = null;
        this.userId = null;
        this.genres = [];
        this.startTracks = [];
        this.algorithm = null;
        this.startYear = null;
        this.endYear = null;
        this.minSpeed = null;
        this.maxSpeed = null;
        this.dynamic = null;
        this.arousal = null;
        this.valence = null;
    }
}
