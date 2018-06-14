/// <reference path="../../typings/tsd.d.ts"/>

module users {
  'use strict';

  export class AuthService {

    private API_PATH = globals.apiUrl;

    public userProfile;
    public isAuthenticated: boolean;

    static $inject = [
      '$rootScope',
      '$http',
      '$q'
    ];

    constructor(
      private $rootScope: ng.IRootScopeService,
      private $http: ng.IHttpService,
      private $q: ng.IQService
    ) {
      this.$rootScope.$watch('isAuthenticated', (value: boolean) => {
        this.isAuthenticated = value;
      })
    }

    login(username: string, password: string): ng.IPromise<{}> {
      var deferred = this.$q.defer();

      this.$http.post(this.API_PATH + '/login', {
        username: username,
        password: password
      })
        .success((data: { access_token: string, expires: number }) => {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('expires', data.expires.toString());

          (<any>this.$rootScope).isAuthenticated = true;
          deferred.resolve();
        })
        .error(data => {
          deferred.reject(data);
        });

      return deferred.promise;
    }

    // Logging out just requires removing the user's
    // id_token and profile
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('expires');
      this.userProfile = {};
      (<any>this.$rootScope).isAuthenticated = false;
    }

    checkLoginStatus(): boolean {
      let expires = localStorage.getItem('expires');
      let now = (new Date().getTime() / 1000);

      let isLoggedIn = false;
      if (expires && parseInt(expires) > now) {
        isLoggedIn = true;
      }

      (<any>this.$rootScope).isAuthenticated = isLoggedIn;
      return isLoggedIn;
    }
  }
}

angular.module('users')
  .service('AuthService', users.AuthService);
