/// <reference path="../../typings/tsd.d.ts"/>

module users {
  'use strict';

  export function tokenInterceptor($q: ng.IQService, $rootScope) {
    return {
      'request': function (config) {
        let token = localStorage.getItem('access_token');
        let expires = localStorage.getItem('expires');
        let now = (new Date().getTime() / 1000);

        if (token && expires && parseInt(expires) > now) {
          config.headers.Authorization = 'Bearer ' + token;
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
