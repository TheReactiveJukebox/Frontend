export class Config {
    public static serverUrl: string;
    public static dev: boolean;

    public static speedUpperLimit: number = 300;
    public static speedLowerLimit: number = 1;
    public static speedStepsize: number = 5;
    public static dynamicStepsize: number = 0.05;
    public static yearStepsize: number = 5;
    public static yearLowerLimit: number = 1800;
    public static yearUpperLimit: number = (new Date()).getFullYear();
    public static dynamicLowerLimit: number = 0;
    public static dynamicUpperLimit: number = 1;
    public static arousalLowerLimit: number = -1;
    public static arousalUpperLimit: number = 1;
    public static valenceLowerLimit: number = -1;
    public static valenceUpperLimit: number = 1;

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
