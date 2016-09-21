/// <reference path="../../typings/tsd.d.ts"/>

module users {
    'use strict';

    export class LoginController {

        static $inject = [
            'lock',
            'AuthService'
        ];

        constructor(
            private lock,
            private AuthService
        ) {
            this.lock.show();
        }

        login() {
            this.AuthService.login();
        }
    }
}

angular.module('users')
    .controller('LoginController', users.LoginController);
