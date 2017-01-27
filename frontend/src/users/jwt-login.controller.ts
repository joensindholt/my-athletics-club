/// <reference path="../../typings/tsd.d.ts"/>

module users {
  'use strict';

  export class JwtLoginController {

    username: string;
    password: string;

    static $inject = [
      'AuthService',
      '$state'
    ];

    constructor(
      private AuthService: AuthService,
      private $state
    ) {
    }

    login() {
      console.log('asd');
      this.AuthService.login(this.username, this.password).then(() => {
        this.$state.go('events');
      });
    }
  }
}

angular.module('users')
  .controller('JwtLoginController', users.JwtLoginController);
