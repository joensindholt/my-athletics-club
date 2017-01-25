/// <reference path="../../typings/tsd.d.ts"/>

module users {
  'use strict';

  export function tokenInterceptor($q: ng.IQService, $rootScope) {
    return {
      'request': function (config) {

        var token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
          $rootScope.isAuthenticated = true;
        }

        return config;
      },
      'responseError': function (rejection) {
        if (rejection.status === 401) {
          $rootScope.isAuthenticated = false;
        }
        return $q.reject(rejection);
      }
    }
  }
}

angular.module('users')
  .factory('tokenInterceptor', users.tokenInterceptor);
