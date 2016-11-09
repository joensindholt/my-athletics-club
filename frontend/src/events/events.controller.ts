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
      console.log('events controller');

      this.SysEventsService.post('Event list shown');

      this.updateEventLists();
      this.listenForChildEvents();
    }

    updateEventLists() {
      if (this.$scope.isAuthenticated) {
        console.log('- user is authenticated');
        this.EventsService.getAll()
          .then(events => {
            this.events = _.orderBy(events, ['date'], ['asc']);
          })
          .catch(err => {
            throw err;
          });
      } else {
        console.log('- user is not authenticated');
        this.EventsService.getEventsOpenForRegistration()
          .then(events => {
            if (events.length === 1) {
              this.$state.go('events_register', { id: events[0]._id });
            }
            else {
              this.events = _.orderBy(events, ['date'], ['asc']);
            }
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
  }
}

angular.module('events')
  .controller('EventsController', events.EventsController);
