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

    private showParticipantEmailList: boolean;
    private participanEmailList: string;
    private copiedDisciplines: any;

    static $inject = [
      '$scope',
      '$state',
      '$window',
      '$document',
      '$sce',
      '$timeout',
      '$element',
      'moment',
      'EventsService',
      'AuthService',
      'hotkeys'
    ];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $window: ng.IWindowService,
      private $document: ng.IDocumentService,
      private $sce: ng.ISCEService,
      private $timeout: ng.ITimeoutService,
      private $element: ng.IRootElementService,
      private moment: moment.MomentStatic,
      private EventsService: EventsService,
      private AuthService: users.AuthService,
      private hotkeys
    ) {
      if (!$state.params.id) {
        $state.go('home');
        return;
      }

      if (!AuthService.isAuthenticated) {
        $state.go('events_register', { id: $state.params.id });
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

      hotkeys.add({
        combo: 'ctrl+c',
        description: 'Kopier discipliner',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: () => {
          console.log('ctrl + c entered');
        } 
      })
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

    participantEmailListClickHandler(event: any) {
      var controller = event.data;
      controller.$scope.$apply(() => {
        if (!controller.$element.find('#showParticipantEmailListElement')[0].contains(event.target)) {
          controller.showParticipantEmailList = false;
          controller.$document.off('click', this.participantEmailListClickHandler);
        }
      });
    }

    toggleParticipantEmailList() {
      this.showParticipantEmailList = !this.showParticipantEmailList;

      if (this.showParticipantEmailList) {
        var list = _.join(_.map(_.uniqBy(this.registrations, r => r.email), r => r.email), ';');
        this.participanEmailList = list;
        this.$timeout(() => {
          this.$document.on('click', this, this.participantEmailListClickHandler);
        }, 100);
      }
      else {
        this.participanEmailList = '';
      }
    }

    copyParticipantEmailListToClipboard() {
      var elem = this.$document.find('#participanEmailListInput');
      elem.select();
      document.execCommand("Copy");
    }

    copyDisciplinesToClipboard(disciplines) {
      this.copiedDisciplines = disciplines;
    }

    pasteDisciplinesFromClipboard(index) {
      (<any>this.event).disciplines[index].disciplines = this.copiedDisciplines;
    }
    
    private updateExcelDownloadUrl() {
      this.excelDownloadUrl = globals.apiUrl + '/events/' + this.event.id + '/registrations.xlsx';
    }
  }
}

angular.module('events')
  .controller('EventEditController', events.EventEditController);
