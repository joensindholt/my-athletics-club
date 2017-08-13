/// <reference path="../../../typings/tsd.d.ts"/>

module core {
    'use strict';

    export class DateService {
        getDateString(date: Date) {
            var mm = date.getMonth() + 1; // getMonth() is zero-based
            var dd = date.getDate();

            return [date.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
            ].join('-');
        }
    }
}

angular.module('core')
    .service('DateService', core.DateService);
