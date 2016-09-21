/// <reference path="../../typings/tsd.d.ts"/>

module users {
    'use strict';

    export class LogoutController {

        static $inject = [
            'AuthService'
        ];

        constructor(
            private AuthService
        ) {
            this.AuthService.logout();
        }
    }
}

angular.module('users')
    .controller('LogoutController', users.LogoutController);
