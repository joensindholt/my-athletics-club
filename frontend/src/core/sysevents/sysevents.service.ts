/// <reference path="../../../typings/tsd.d.ts"/>

module core {
    'use strict';

    export class SysEventsService {

        private API_PATH = globals.apiUrl;;

        static $inject = [
            '$http',
            '$q',
            'AuthService'
        ];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private AuthService: users.AuthService
        ) {
        }

        post(title: string): ng.IHttpPromise<any> {
            
            var sysEvent = new SysEvent(title);

            if (this.AuthService.userProfile) {
                sysEvent.userProfile = {
                    email: this.AuthService.userProfile.email,
                }
            }
            
            return this.$http.post(this.API_PATH + '/sysevents', sysEvent);
        }
    }
}

angular.module('core')
    .service('SysEventsService', core.SysEventsService);
