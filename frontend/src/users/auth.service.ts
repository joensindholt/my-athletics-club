/// <reference path="../../typings/tsd.d.ts"/>

module users {
    'use strict';

    export class AuthService {

        public userProfile;
        public isAuthenticated: boolean;

        static $inject = [
            '$rootScope',
            'lock',
            'authManager'
        ];

        constructor(
            private $rootScope: ng.IRootScopeService,
            private lock,
            public authManager
        ) {
            this.userProfile = JSON.parse(localStorage.getItem('profile')) || {};

            this.$rootScope.$watch('isAuthenticated', (value: boolean) => {
                this.isAuthenticated = value;
            })            
        }

        login() {
            this.lock.show();
        }

        // Logging out just requires removing the user's
        // id_token and profile
        logout() {
            localStorage.removeItem('id_token');
            localStorage.removeItem('profile');
            this.authManager.unauthenticate();
            this.userProfile = {};
        }

        // Set up the logic for when a user authenticates
        // This method is called from app.run.js
        registerAuthenticationListener() {
            this.lock.on('authenticated', (authResult) => {
                localStorage.setItem('id_token', authResult.idToken);
                this.authManager.authenticate();

                this.lock.getProfile(authResult.idToken, (error, profile) => {
                    if (error) {
                        console.log(error);
                    }

                    localStorage.setItem('profile', JSON.stringify(profile));
                    this.$rootScope.$broadcast('userProfileSet', profile);
                });
            });
        }
    }
}

angular.module('users')
    .service('AuthService', users.AuthService);
