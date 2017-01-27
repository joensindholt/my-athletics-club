/// <reference path="../../typings/tsd.d.ts"/>

module events {
  'use strict';

  export class EventEditController {

    private event: Event;
    private availableDisciplines: Array<any>;
    private ageGroups: Array<any>;
    private datePickerOptions = {
      startingDay: 1
    }
    private registrations: Array<Registration>;
    private excelDownloadUrl: string;
    private showSave: boolean;
    
    static $inject = [
      '$scope',
      '$state',
      '$window',
      '$sce',
      '$timeout',
      'moment',
      'EventsService',
      'AuthService'
    ];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $window: ng.IWindowService,
      private $sce: ng.ISCEService,
      private $timeout: ng.ITimeoutService,
      private moment: moment.MomentStatic,
      private EventsService: EventsService,
      private AuthService: users.AuthService
    ) {
      if (!$state.params.id) {
        $state.go('home');
        return;
      }

      if (!AuthService.isAuthenticated) {
        $state.go('events_register', {id: $state.params.id});
        return;
     }

      // load default available disciplines      
      this.availableDisciplines = this.EventsService.getAllDisciplines();

      // load age groups      
      this.ageGroups = this.EventsService.getAgeGroups();

      // get event...
      this.EventsService.get($state.params.id).then(event => {
        // init controller event
        this.event = event;
        // init event disciplines
        this.updateDisciplines(this.event);
        // resolve excel download url
        this.updateExcelDownloadUrl();

        if (!this.event.registrationPeriodStartDate) {
          this.event.registrationPeriodStartDate = new Date();
        }

        if (!this.event.registrationPeriodEndDate) {
          this.event.registrationPeriodEndDate = new Date();
        }
      });

      // get event registrations      
      this.EventsService.getRegistrations($state.params.id).then(registrations => {
        // init controller registrations - ordered by name
        this.registrations = _.orderBy(registrations, ['name']);
      });
    }

    updateDisciplines(event: Event) {

      if (!event.disciplines || event.disciplines.length === 0) {
        event.disciplines = [];
        for (var i = 0; i < this.ageGroups.length; i++) {
          event.disciplines.push({ ageGroup: this.ageGroups[i], disciplines: [] });
        }
      }
    }

    saveNow(event: Event) {
      this.event.registrationPeriodStartDate.setUTCHours(0, 0, 0, 0);
      this.event.registrationPeriodEndDate.setUTCHours(0, 0, 0, 0);

      this.EventsService.update(event).then(() => {
        this.showSave = false;
      });
    }

    private updateExcelDownloadUrl() {
      this.excelDownloadUrl = globals.apiUrl + '/events/' + this.event.id + '/registrations.xlsx';
    }
  }
}

angular.module('events')
  .controller('EventEditController', events.EventEditController);
