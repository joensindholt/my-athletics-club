/// <reference path="../../typings/tsd.d.ts"/>

module users {
  'use strict';

  export class LoginController {

    username: string;
    password: string;
    loginError: string;

    static $inject = [
      'AuthService',
      '$state'
    ];

    constructor(
      private AuthService: AuthService,
      private $state
    ) {
      this.AuthService.logout();
    }

    login() {
      this.loginError = null;
      this.AuthService.login(this.username, this.password)
        .then(() => {
          this.$state.go('events');
        })
        .catch((err: any) => {
          this.loginError = 'Hmmm...vi kunne ikke logge dig ind. Har du angivet din email og adgangskode korrekt?';
        });
    }
  }
}

angular.module('users')
  .controller('LoginController', users.LoginController);
