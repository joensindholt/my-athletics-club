module events {
  'use strict';

  export function eventListItemComponent() {
    return {
      templateUrl: 'events/event-list-item.component/event-list-item.component.html',
      controller: events.EventListItemController,
      bindings: {
        event: '<'
      }
    }
  }

  export class EventListItemController {

    event: events.Event;
    isAuthenticated: boolean;

    static $inject = [
      '$scope',
      '$window',
      'EventsService',
      'moment',
      'AuthService'
    ];

    constructor(
      private $scope: ng.IScope,
      private $window: ng.IWindowService,
      private EventsService: EventsService,
      private moment: moment.MomentStatic,
      private authService: users.AuthService
    ) {
      this.isAuthenticated = this.authService.isAuthenticated;
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

    getDisciplineClass(discipline, registration) {
      if (discipline.ageClass) {
        return discipline.ageClass;
      }

      return registration.ageClass;
    }

    handleEventDeleteClicked(event: Event) {
      if (this.$window.confirm(`Er du sikker på at du vil slette ${event.title}?`)) {
        this.EventsService.delete(event).then(() => {
          this.$scope.$emit('event-deleted', event);
        });
      }
    }
  }
}

angular.module('events')
  .component('eventListItem', events.eventListItemComponent());