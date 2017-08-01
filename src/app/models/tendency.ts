/**
 * Model class for a tendency
 */
export class Tendency {
    id: number;
    userId: number;
    radioId: number;
    moreDynamics: boolean;
    lessDynamics: boolean;
    slower: boolean;
    faster: boolean;
    startOlder: boolean;
    startNewer: boolean;
    endOlder: boolean;
    endNewer: boolean;
    moreOfGenre?: string;

    meanDynamic: number;
    meanSpeed: number;
    meanYear: number;
}
