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
      'SysEventsService'
    ];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $window: ng.IWindowService,
      private $sce: ng.ISCEService,
      private $timeout: ng.ITimeoutService,
      private moment: moment.MomentStatic,
      private EventsService: EventsService,
      private SysEventsService: core.SysEventsService
    ) {
      if (!$state.params.id) {
        $state.go('home');
        return;
      }

      this.SysEventsService.post('Event shown. Id: ' + $state.params.id);

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
      this.EventsService.update(event).then(() => {
        this.showSave = false;
      });
    }

    private updateExcelDownloadUrl() {
      this.excelDownloadUrl = globals.apiUrl + '/events/' + this.event._id + '/registrations.xlsx';
    }
  }
}

angular.module('events')
  .controller('EventEditController', events.EventEditController);
