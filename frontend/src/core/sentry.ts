declare var Raven: any;

class SentryConfig {

    ignoreUrls: Array<any> = [
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i
    ];

    constructor() {
    }

    configure = () => {
        var ravenOptions = {
            release: 1,
            shouldSendCallback: (data) => {
                return globals.sentryErrors;
            },
            ignoreUrls: this.ignoreUrls
        };

        Raven.config('https://2a92c58d79ae46b982f859c4d54c7474@sentry.io/98130', ravenOptions)
            .addPlugin(Raven.Plugins.Angular)
            .install();
    }

    // TODO: NOT IMPLEMENTED YET    
    // angularConfigure = ($ravenProvider: any) => {
    //     // If we do not send errors anywhere we tell the angular raven lib to work in dev mode where it
    //     // just logs to the console and nothing else. This is only for performance and cleanliness
    //     var sendingErrors: boolean = globals.sentryErrors;
    //     $ravenProvider.development(!sendingErrors);
    // }
}
