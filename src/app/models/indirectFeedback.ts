//Author David Spain

export class IndirectFeedback{

    feedbackName:string; //Type of indirect feedback
    id:number;  // Id in database for this entry
    userId:number;
    position: number;

    constructor(
        public radioId:number, //Radio context the feedback was given in
        public trackId:number, // current played song
        position:number, // Position in seconds in the Song
        public toTrackId?:number //For skips, song that was skipped to
        ){
            this.feedbackName = 'INVALID';
            this.position = Math.floor(position); //Interpretation as integer
        }

    //Setting of the name is solved this way to keep consistency between the POJO and the enum in backend
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