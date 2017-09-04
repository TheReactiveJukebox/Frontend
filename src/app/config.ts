export class Config {
    public static serverUrl: string;
    public static dev: boolean;

    public static speedUpperLimit = 300;
    public static speedLowerLimit = 1;
    public static speedStepsize = 5;
    public static dynamicStepsize = 0.05;
    public static yearStepsize = 5;
    public static yearLowerLimit = 1800;
    public static yearUpperLimit = (new Date()).getFullYear();

    public static config: any = {

        development: {
            //serverUrl: 'https://192.168.99.100',
            serverUrl: 'https://localhost',
            dev: true
        },

        production: {
            serverUrl: 'https://pg.netz1984.de:4799',
            dev: false
        }
    };

    constructor(env?: string) {
        if (!env) {
            env = 'development';
        }
        Config.serverUrl = Config.config[env].serverUrl;
        Config.dev = Config.config[env].dev;
    }

}
