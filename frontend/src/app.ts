/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="core/sentry.ts"/>
/// <reference path="core/moment/moment.ts"/>
/// <reference path="core/globals.ts"/>

// SENTRY - needs to be the first thing going on
new SentryConfig().configure();

module app {
  'use strict';

  angular
    .module('app', [
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
      'angular-autogrow',
      'multipleSelect',
      'cfp.hotkeys',
      'ngCsv',
      'chart.js'
    ])
    .config(['$stateProvider', '$httpProvider', config])
    .run(['AuthService', run]);

  angular.module('core', ['ngSanitize']);
  angular.module('events', []);
  angular.module('members', []);
  angular.module('Registrations', []);
  angular.module('users', []);
  angular.module('featuretoggles', []);

  function config($stateProvider: angular.ui.IStateProvider, $httpProvider: ng.IHttpProvider) {
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
      })
      .state('members_edit', {
        url: '/members/edit/{id}',
        templateUrl: 'members/member.edit.html',
        controller: 'MemberEditController',
        controllerAs: 'vm'
      })
      .state('members_stats', {
        url: '/members/statistics',
        templateUrl: 'members/member.statistics.html',
        controller: 'MemberStatisticsController',
        controllerAs: 'vm'
      })
      .state('members_terminated', {
        url: '/members/terminated',
        templateUrl: 'members/terminated/terminated-members.html',
        controller: 'TerminatedMembersController',
        controllerAs: 'vm'
      });

    $httpProvider.interceptors.push('tokenInterceptor');
  }

  function run(authService) {
    let isLoggedIn = authService.checkLoginStatus();
    console.log('App running', isLoggedIn);
  }
}
