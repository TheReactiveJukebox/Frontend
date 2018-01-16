export class Config {
    public static serverUrl: string;
    public static dev: boolean;
    public static study: boolean;
    public static slackUrl: string;

    public static speedUpperLimit: number = 300;
    public static speedLowerLimit: number = 1;
    public static yearUpperLimit: number = (new Date()).getFullYear();
    public static arousalLowerLimit: number = -1;
    public static arousalUpperLimit: number = 1;
    public static valenceLowerLimit: number = -1;
    public static valenceUpperLimit: number = 1;
    public static genreDisplayLimit: number = 4;
    public static startTrackLimit: number = 10;
    public static trackSearchResultLimit: number = 30;
    public static artistSearchResultLimit: number = 15;
    public static albumSearchResultLimit: number = 15;

    public static numberUpcomingSongs: number = 5;
    public static numberFetchedSongs: number = 40;

    public static backendLogLimit: number = 100;

    public static config: any = {

        development: {
            serverUrl: window.location.origin,
            dev: true,
            slackUrl: '', //for local development dont push to slack. check your console!
            study: true
        },

        production: {
            serverUrl: window.location.origin,
            dev: false,
            slackUrl: 'https://hooks.slack.com/services/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',
            study: true
        }
    };

    constructor(env?: string) {
        if (!env) {
            env = 'development';
        }
        Config.serverUrl = Config.config[env].serverUrl;
        Config.dev = Config.config[env].dev;
        Config.study = Config.config[env].study;
        Config.slackUrl = Config.config[env].slackUrl;
    }

}
