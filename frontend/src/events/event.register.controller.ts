/// <reference path="../../typings/tsd.d.ts"/>

module events {
  'use strict';

  export class EventRegisterController {

    private event: Event;
    private registration: Registration;
    private trustedMapUrl: string;
    private registrationIsValid: boolean = false;
    private alerts: Array<any> = [];
    private registering: boolean = false;
    private registrationComplete: boolean = false;
    private birthYears: Array<number>;

    static $inject = [
      '$scope',
      '$state',
      '$window',
      '$sce',
      '$timeout',
      'moment',
      'EventsService',
      'SysEventsService',
      'MembersService'
    ];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $window: ng.IWindowService,
      private $sce: ng.ISCEService,
      private $timeout: ng.ITimeoutService,
      private moment: moment.MomentStatic,
      private EventsService: EventsService,
      private SysEventsService: core.SysEventsService,
      private MembersService: members.MembersService
    ) {
      this.SysEventsService.post('Registration page shown');

      this.registration = new Registration({});

      this.EventsService.get($state.params.id).then(event => {
        this.event = event;
        this.trustedMapUrl = this.$sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyC-0IZYk7mmRswHapPmWnSpMa6i2kHnP9I&q=' + event.address);
      });

      this.birthYears = this.MembersService.getAllowedBirthYears();
    }

    getSelectedDisciplines() {
      var disciplines = _.map(_.filter(this.event.disciplines, discipline => {
        return discipline.selected;
      }), discipline => {
        return {
          id: discipline.id,
          name: discipline.name,
          personalRecord: discipline.personalRecord
        }
      });
      return disciplines;
    }

    validate(registration: Registration) {
      if (!registration.name || registration.name.trim() === '') {
        this.registrationIsValid = false;
        return;
      }

      if (!registration.gender || registration.gender.trim() === '') {
        this.registrationIsValid = false;
        return;
      }

      if (!registration.birthYear) {
        this.registrationIsValid = false;
        return;
      }

      if (!registration.email || registration.email.trim() === '') {
        this.registrationIsValid = false;
        return;
      }

      if (this.getSelectedDisciplines().length === 0) {
        this.registrationIsValid = false;
        return;
      }

      if (!registration.recaptcha) {
        this.registrationIsValid = false;
        return;
      }

      this.registrationIsValid = true;
    }

    validateDelayed() {
      this.$timeout(() => {
        this.validate(this.registration);
      }, 200);
    }

    register(registration: Registration) {
      this.alerts = [];
      this.registering = true;

      registration.eventId = this.event._id;
      registration.disciplines = this.getSelectedDisciplines();

      this.SysEventsService.post('Event registration posting for email: ' + registration.email);
      this.EventsService.register(registration).then(data => {
        this.SysEventsService.post('Event registration succeeded for email:' + registration.email);
        this.registrationComplete = true;
      }).catch(err => {
        this.SysEventsService.post('Event registration failed for email ' + registration.email + ' with error: ' + err);
        this.alerts.push({ type: 'danger', msg: 'Hov, noget gik galt under din registrering. Prøv lige en gang til eller kontakt GIK direkte.' });
      }).finally(() => {
        this.registering = false;
      });
    }
  }
}

angular.module('events')
  .controller('EventRegisterController', events.EventRegisterController);
