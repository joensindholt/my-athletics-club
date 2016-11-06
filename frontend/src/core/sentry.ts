declare var Raven: any;

class SentryConfig {

    ignoreUrls: Array<any> = [
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i
    ];

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
}
