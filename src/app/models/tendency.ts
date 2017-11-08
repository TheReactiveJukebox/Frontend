/**
 * Model class for a tendency
 */
export class Tendency {
    id: number;
    userId: number;
    radioId: number;

    preferredDynamics: number;
    preferredSpeed: number;
    preferredPeriodStart: number;
    preferredPeriodEnd: number;

    constructor(jsonObject?) {
        if (jsonObject) {
            this.id = jsonObject.id;
            this.preferredDynamics = jsonObject.preferredDynamics;
            this.preferredSpeed = jsonObject.preferredSpeed;
            this.preferredPeriodStart = jsonObject.preferredPeriodStart;
            this.preferredPeriodEnd = jsonObject.preferredPeriodEnd;
            this.userId = jsonObject.userId;
        }
    }
}

