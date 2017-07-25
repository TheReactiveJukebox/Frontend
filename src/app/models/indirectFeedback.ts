//Author David Spain

export class IndirectFeedback{
    id:number; // Id in database for this entry
    radioId:number;
    userId:number;
    trackId:number; // current played song
    position:number; // Position in seconds in the Song
    toTrackId:number; // skip to this song
    feedbackName:string;
}