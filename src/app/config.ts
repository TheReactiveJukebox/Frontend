export class Config {
    public static serverUrl: string;
    public static dev: boolean;

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
        if (!env) env = 'development';
        Config.serverUrl = Config.config[env].serverUrl;
        Config.dev = Config.config[env].dev;
    }

}
