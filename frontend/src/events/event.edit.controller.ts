/// <reference path="../../typings/tsd.d.ts"/>

module events {
  'use strict';

  export class EventEditController {

    private event: Event;
    private availableDisciplines: Array<any>;
    private customDisciplines: Array<any>;
    private datePickerOptions = {
      startingDay: 1
    }
    private customDisciplineDefault: string = "anden disciplin";
    private customDiscipline: string;
    private trustedMapUrl: any;
    private registrations: Array<Registration>;
    private excelDownloadUrl: string;

    static $inject = [
      '$scope',
      '$state',
      '$window',
      '$sce',
      'moment',
      'EventsService',
      'SysEventsService'
    ];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $window: ng.IWindowService,
      private $sce: ng.ISCEService,
      private moment: moment.MomentStatic,
      private EventsService: EventsService,
      private SysEventsService: core.SysEventsService
    ) {
      this.SysEventsService.post('Event shown. Id: ' + $state.params.id);

      this.availableDisciplines = this.EventsService.getAllDisciplines();
      this.customDisciplines = [];
      this.customDiscipline = this.customDisciplineDefault;

      this.EventsService.get($state.params.id).then(event => {
        this.event = event;
        this.updateSelectedAvailableDisciplines();
        this.updateTrustedMapUrl(this.event);
        this.updateExcelDownloadUrl();
      });

      this.EventsService.getRegistrations($state.params.id).then(registrations => {
        this.registrations = _.orderBy(registrations, ['name']);
      });

    }

    update(event: Event) {
      this.updateDebounced(event);
    }

    updateTrustedMapUrl(event: Event) {
      this.trustedMapUrl = this.$sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyC-0IZYk7mmRswHapPmWnSpMa6i2kHnP9I&q=' + event.address);
    }

    getSelectedDisciplines() {
      var disciplines = _.map(_.filter(this.availableDisciplines, discipline => {
        return discipline.selected;
      }), discipline => {
        return {
          id: discipline.id,
          name: discipline.name,
          classes: _.map(_.filter(discipline.classes, (classs: any) => {
            return classs.selected;
          }), classs => {
            return classs.name;            
          })
        }
      });

      var customDisciplines = _.map(_.filter(this.customDisciplines, discipline => {
        return discipline.selected;
      }), discipline => {
        return { id: discipline.id, name: discipline.name }
      });

      return _.union(disciplines, customDisciplines);
    }

    updateSelectedAvailableDisciplines() {
      this.customDisciplines = _.map(_.filter(this.event.disciplines, d => { return d.id === -1 }) || [], d => {
        return {
          id: -1,
          name: d.name,
          selected: true
        };
      });

      // look for selected disciplines
      this.availableDisciplines.forEach(discipline => {
        this.event.disciplines.forEach(apiDiscipline => {
          if (discipline.id === apiDiscipline.id) {
            discipline.selected = true;
            // look for selected classes
            discipline.classes.forEach(classs => {
              apiDiscipline.classes.forEach(apiClass => {
                if (classs.name === apiClass) {
                  classs.selected = true;
                }
              });
            });
          }
        })
      });
    }

    addCustomDiscipline(discipline: string) {
      if (discipline === this.customDisciplineDefault) return;
      if (discipline === '') return;

      this.customDisciplines.push({
        id: -1,
        selected: true,
        name: discipline
      });

      this.customDiscipline = this.customDisciplineDefault;

      this.update(this.event);
    }

    handleCustomerDisciplineKeyPress(discipline: string, event) {
      if (event.keyCode === 13) {
        this.addCustomDiscipline(discipline);
      }
    }

    updateDebounced = _.debounce(event => {
      event.disciplines = this.getSelectedDisciplines();
      this.EventsService.update(event);
      this.updateTrustedMapUrl(event);
    }, 2000)

    private updateExcelDownloadUrl() {
      this.excelDownloadUrl = globals.apiUrl + '/events/' + this.event._id + '/registrations.xlsx';
    }

    toggleDisciplineSelected(discipline) {
      if (!discipline.selected) {
        discipline.selected = true;
        _.forEach(discipline.classes, classs => { classs.selected = true });
      }
      else {
        discipline.selected = false;
        _.forEach(discipline.classes, classs => { classs.selected = false; });
      }
    }
  }
}

angular.module('events')
  .controller('EventEditController', events.EventEditController);
