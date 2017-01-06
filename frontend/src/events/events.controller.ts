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
      '$state',
      '$window',
      'moment',
      'EventsService',
      'AuthService',
      'SysEventsService'
    ];

    constructor(
      private $scope: IScope,
      private $state,
      private $window: ng.IWindowService,
      private moment: moment.MomentStatic,
      private EventsService: EventsService,
      private AuthService: users.AuthService,
      private SysEventsService: core.SysEventsService
    ) {
      this.SysEventsService.post('Event list shown');

      this.updateEventLists();
      this.listenForChildEvents();
    }

    updateEventLists() {
      if (this.$scope.isAuthenticated) {
        this.EventsService.getAll()
          .then(events => {
            this.events = _.orderBy(events, ['date'], ['asc']);

            _.each(this.events, event => {
              event.registrationsStatus = 'pending';
              this.getRegistrations(event);
            });
          })
          .catch(err => {
            throw err;
          });
      } else {
        this.EventsService.getPublicEvents()
          .then(events => {
            this.events = _.orderBy(events, ['date'], ['asc']);

            _.each(this.events, event => {
              event.registrationsStatus = 'pending';
              this.getRegistrations(event);
            });
          })
          .catch(err => {
            throw err;
          });
      }
    }

    addEvent() {
      this.EventsService.add(new Event({})).then(event => {
        this.$state.go('events_edit', { id: event._id });
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
          _.remove(this.events, { _id: event._id });
        });
      }
    }

    logout() {
      this.AuthService.logout();
      this.$state.go('login');
    }

    isImminent(date: Date) {
      if (!date) {
        return false;
      }

      var now = new Date();
      now.setHours(0, 0, 0, 0);
      var diff = (date.getTime() - now.getTime());
      var millisecondsOnADay = 1000 * 60 * 60 * 24;
      return diff < millisecondsOnADay * 5;
    }

    getDateFromNow(date: Date) {
      if (!date) {
        return '';
      }

      var today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      if (this.moment(date).isSame(new Date(), 'day')) {
        return 'i dag';
      } 

      return this.moment(date).from(today);
    }

    getRegistrations(event: Event) {
      this.EventsService.getRegistrations(event._id).then(registrations => {
        event.registrations = registrations;
        event.registrationsStatus = 'fetched';
      });
    }
  }
}

angular.module('events')
  .controller('EventsController', events.EventsController);
