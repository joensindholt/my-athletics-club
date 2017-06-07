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
      .success((data: { access_token: string }) => {
        localStorage.setItem('access_token', data.access_token);
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
      this.userProfile = {};
      (<any>this.$rootScope).isAuthenticated = false;
    }

    isLoggedInOnServer() {
      return this.$http.get(this.API_PATH + '/isloggedin');
    }
  }
}

angular.module('users')
  .service('AuthService', users.AuthService);
