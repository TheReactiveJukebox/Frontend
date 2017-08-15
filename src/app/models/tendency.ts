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

    preferredDynamics: number;
    preferredSpeed: number;
    preferredPeriodStart: number;
    preferredPeriodEnd: number;

    speedUpperlimit = 400;
    speedLowerLimit = 1;
    speedStepsize = 5;
    dynamicStepsize = 0.1;
    yearStepsize = 5;
    yearLowerLimit = 1800;
    yearUpperLimit = new Date().getFullYear();
}

