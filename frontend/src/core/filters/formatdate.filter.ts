/// <reference path="../../../typings/tsd.d.ts"/>

module core {
    export function formatdate(moment) {
        return function(input, format) {
            // use danish locale
            moment.locale('da');
            // default to danish short date format
            format = format || 'LL';
            // use moment to parse date
            var date = moment(input, 'YYYY/MM/DD');

            return date.format(format);
        }
    }
}

angular.module('core')
    .filter('formatdate', ['moment', core.formatdate]);
