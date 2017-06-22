/// <reference path="../../typings/tsd.d.ts"/>

module events {
  'use strict';

  interface IScope extends ng.IScope {
    isAuthenticated: boolean;
  }

  export class EventsController {

    events: Array<Event>;
    oldEvents: Array<Event>;

    static $inject = [
      '$scope',
      '$rootScope',
      '$state',
      '$window',
      'EventsService',
      'AuthService'
    ];

    constructor(
      private $scope: IScope,
      private $rootScope,
      private $state,
      private $window: ng.IWindowService,
      private EventsService: EventsService,
      private AuthService: users.AuthService
    ) {
      this.updateEventLists();
      this.listenForChildEvents();
    }

    updateEventLists() {
      if (this.$scope.isAuthenticated) {
        this.EventsService.getAll()
          .then(events => {
            this.handleServerEventsReceived(events);
          })
          .catch(err => {
            throw err;
          });
      } else {
        this.EventsService.getPublicEvents()
          .then(events => {
            this.handleServerEventsReceived(events);
          })
          .catch(err => {
            throw err;
          });
      }
    }

    handleServerEventsReceived(events: Event[]) {
      // get registrations for all events - one by one
      _.each(events, event => {
        event.registrationsStatus = 'pending';
        this.getRegistrations(event);
      });

      // resolve current and old events
      let activeEvents = _.filter(events, e => !e.isOldEvent);
      let oldEvents = _.filter(events, e => e.isOldEvent);

      // populate lists      
      this.events = _.orderBy(activeEvents, ['date'], ['asc']);
      this.oldEvents = _.orderBy(oldEvents, ['date'], ['desc']);
    }

    addEvent() {
      this.EventsService.add(new Event({})).then(event => {
        this.$state.go('events_edit', { id: event.id });
      });
    }

    listenForChildEvents() {
      this.$scope.$on('event-added', event => {
        this.updateEventLists();
      });

      this.$scope.$on('event-updated', event => {
        this.updateEventLists();
      });

      this.$scope.$on('event-deleted', () => {
        this.updateEventLists();
      });
    }

    handleEventDeleteClicked(event: Event) {
      if (this.$window.confirm('Er du sikker?')) {
        this.EventsService.delete(event).then(() => {
          _.remove(this.events, { id: event.id });
        });
      }
    }

    logout() {
      this.AuthService.logout();
      this.$state.go('login');
    }

    getRegistrations(event: Event) {
      this.EventsService.getRegistrations(event.id).then(registrations => {

        _.each(registrations, registration => {
          registration.disciplines = registration.disciplines.concat(<any>registration.extraDisciplines);
        })

        event.registrations = registrations;
        event.registrationsStatus = 'fetched';
      });
    }
  }
}

angular.module('events')
  .controller('EventsController', events.EventsController);
