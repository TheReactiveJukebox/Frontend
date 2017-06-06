export class Config {
    public static serverUrl: string;
    public static dev: boolean;

    public static config: any = {

        development: {
            serverUrl: 'http://localhost:8080', // fill in your local server ip and port
            dev: true
        },

        production: {
            serverUrl: '129.217.62.109', // add correct port to live server
            dev: false
        }
    };

    constructor(env?: string) {
        if (!env) env = 'development';
        Config.serverUrl = Config.config[env].serverUrl;
        Config.dev = Config.config[env].dev;
    }

}
