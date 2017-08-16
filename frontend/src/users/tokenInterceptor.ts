/// <reference path="../../typings/tsd.d.ts"/>

module users {
  'use strict';

  export function tokenInterceptor(
    $q: ng.IQService,
    $rootScope,
    $injector
  ) {
    return {
      'request': function (config) {
        let token = localStorage.getItem('access_token');

        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
      },
      'responseError': function (rejection) {
        if (rejection.status === 401) {
          $rootScope.isAuthenticated = false;
          let stateService = $injector.get('$state'); 
          stateService.go('login');
        }
        return $q.reject(rejection);
      }
    }
  }
}

angular.module('users')
  .factory('tokenInterceptor', users.tokenInterceptor);
