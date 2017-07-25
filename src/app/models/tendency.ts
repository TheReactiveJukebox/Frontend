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
    older: boolean;
    newer: boolean;
    moreOfGenre?: string;
}
