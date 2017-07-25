//Author David Spain

export class IndirectFeedback{

    feedbackName:string;
    id:number;  // Id in database for this entry
    userId:number;

    constructor(
        public radioId:number,
        public trackId:number, // current played song
        public position:number, // Position in seconds in the Song
        public toTrackId?:number
        ){
            this.feedbackName = 'INVALID';
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