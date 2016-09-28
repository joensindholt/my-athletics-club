/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="core/sentry.ts"/>
/// <reference path="core/moment/moment.ts"/>
/// <reference path="core/globals.ts"/>

// SENTRY - needs to be the first thing going on
new SentryConfig().configure();

module app {
  'use strict';

  angular.module('app', [
    // External modules
    'ngRoute',
    'ui.router',
    // App modules
    'core',
    'events',
    'featuretoggles',
    'members',
    'Registrations',
    'users',
    // Third party modules
    'ngRaven',
    'momentjs',
    'checklist-model',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ui.bootstrap.datepickerPopup',
    'vcRecaptcha',
    // Auth0
    'auth0.lock',
    'angular-jwt'
    // ---
  ]).config(['$stateProvider', 'lockProvider', '$httpProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', config])
    .run(['AuthService', 'authManager', run])

  angular.module('core', []);
  angular.module('events', []);
  angular.module('members', []);
  angular.module('Registrations', []);
  angular.module('users', []);
  angular.module('featuretoggles', []);

  function config(
    $stateProvider: angular.ui.IStateProvider,
    lockProvider,
    $httpProvider: ng.IHttpProvider,
    jwtOptionsProvider,
    jwtInterceptorProvider
  ) {
    lockProvider.init({
      clientID: 'CgM7GD6XzCaYlhZWso6byg65GGplkFoP',
      domain: 'joensindholt.eu.auth0.com',
      options: {
        container: 'login_container',
        allowSignUp: false,
        languageDictionary: {
          title: 'Log in'
        }
      }
    });

    $stateProvider
      .state('home', {
        url: '',
        templateUrl: 'core/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('events', {
        url: '/events',
        templateUrl: 'events/events.html',
        controller: 'EventsController',
        controllerAs: 'vm'
      })
      .state('events_edit', {
        url: '/events/{id}/edit',
        templateUrl: 'events/event.edit.html',
        controller: 'EventEditController',
        controllerAs: 'vm'
      })
      .state('events_register', {
        url: '/events/{id}',
        templateUrl: 'events/event.register.html',
        controller: 'EventRegisterController',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'users/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout',
        templateUrl: 'users/logout.html',
        controller: 'LogoutController',
        controllerAs: 'vm'
      })
      .state('members', {
        url: '/members',
        templateUrl: 'members/members.html',
        controller: 'MembersController',
        controllerAs: 'vm'
      })
      .state('members_add', {
        url: '/members/add',
        templateUrl: 'members/member.add.html',
        controller: 'MemberAddController',
        controllerAs: 'vm'
      });

    jwtOptionsProvider.config({
      tokenGetter: function () {
        return localStorage.getItem('id_token');
      },
      whiteListedDomains: ['joensindholt.eu.auth0.com', globals.apiDomain]
    });

    $httpProvider.interceptors.push('jwtInterceptor');
  }

  function run(authService, authManager) {
    // Put the authService on $rootScope so its methods
    // can be accessed from the nav bar
    authService.registerAuthenticationListener();

    // Use the authManager from angular-jwt to check for
    // the user's authentication state when the page is
    // refreshed and maintain authentication
    authManager.checkAuthOnRefresh();

    console.log('app running');
  }
}
