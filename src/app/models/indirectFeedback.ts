//Author David Spain

export class IndirectFeedback{

    feedbackName:string;
    id:number;  // Id in database for this entry
    userId:number;
    position: number;

    constructor(
        public radioId:number,
        public trackId:number, // current played song
        position:number, // Position in seconds in the Song
        public toTrackId?:number
        ){
            this.feedbackName = 'INVALID';
            this.position = Math.floor(position);
        }

    public makeDeleteFeedback(): void {
        this.feedbackName = 'DELETE';
    }

    public makeSkipFeedback(): void {
        this.feedbackName = 'SKIP';
    }

    public makeMultiSkipFeedback(): void {
        this.feedbackName = 'MULTI_SKIP';
    }
}