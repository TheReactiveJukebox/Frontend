export class Mood {

    private _id: number;
    private _name: string;
    private _arousal: number;
    private _valence: number;

    constructor(pId: number, pName: string, pArousal: number, pValence: number) {
        this._id = pId;
        this._name = pName;
        this._arousal = pArousal;
        this._valence = pValence;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get arousal(): number {
        return this._arousal;
    }
    get valence(): number {
        return this._valence;
    }

}
