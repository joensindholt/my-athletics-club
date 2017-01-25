/// <reference path="../../typings/tsd.d.ts"/>

module users {
  'use strict';

  export class JwtLoginController {

    username: string;
    password: string;

    static $inject = [
      'JwtAuthService',
      '$state'
    ];

    constructor(
      private JwtAuthService: JwtAuthService,
      private $state
    ) {
    }

    login() {
      console.log('asd');
      this.JwtAuthService.login(this.username, this.password).then(() => {
        this.$state.go('events');
      });
    }
  }
}

angular.module('users')
  .controller('JwtLoginController', users.JwtLoginController);
