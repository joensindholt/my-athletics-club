/// <reference path="../../typings/tsd.d.ts"/>

declare var toastr: any;

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
    private currentlyFocusedDisciplines: any;

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
        this.registrations = _.orderBy(registrations, ['timestamp']);
      });

      hotkeys.add({
        combo: 'ctrl+c',
        description: 'Kopier discipliner',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: (e) => {
          if (this.currentlyFocusedDisciplines) {
            this.copyDisciplinesToClipboard(this.currentlyFocusedDisciplines);
          }
        } 
      });

      hotkeys.add({
        combo: 'ctrl+s',
        description: 'Gem ændringer',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: (e) => {
          this.saveNow(this.event);
          e.preventDefault();
        }         
      })
    }

    onDisciplineSelectFocus(disciplines) {
      this.currentlyFocusedDisciplines = disciplines;
    }

    updateDisciplines(event: Event) {
      // make sure we have at least an empty 
      // set of disciplines on the event
      if (!event.disciplines) {
        event.disciplines = [];
      }

      // create new sanitized list of disciplines with all agegroups
      var sanitized = [];
      for (var i = 0; i < this.ageGroups.length; i++) {
        var ageGroup = this.ageGroups[i];
        var existing = _.find(event.disciplines, d => d.ageGroup === ageGroup);
        if (existing) {
          sanitized[i] = existing;
        } else {
          sanitized[i] = { ageGroup: this.ageGroups[i], disciplines: [] };
        }
      }

      // override event disciplines with the sanitized list
      event.disciplines = sanitized;
    }

    saveNow(event: Event) {
      this.EventsService.update(event).then(() => {
        this.showSave = false;
        toastr.info('Dine ændringer er gemt');
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
      this.copiedDisciplines = _.clone(disciplines);
      var disciplineText = disciplines.length == 1 ? 'disciplin' : 'discipliner';
      toastr.info(disciplines.length + ' ' + disciplineText + ' kopieret til udklipsholderen');
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
