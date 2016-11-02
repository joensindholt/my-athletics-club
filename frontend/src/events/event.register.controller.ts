/// <reference path="../../typings/tsd.d.ts"/>

module events {
  'use strict';

  export class EventRegisterController {

    private event: Event;
    private registration: Registration;
    private registrationData: any;
    private trustedMapUrl: string;
    private registrationIsValid: boolean = false;
    private alerts: Array<any> = [];
    private registering: boolean = false;
    private registrationComplete: boolean = false;
    private birthYears: Array<number>;
    private ageGroups: Array<string>;
    private validationError: string;
    
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

      this.EventsService.get($state.params.id).then(event => {
        this.event = event;

        if (event.address) {
          this.trustedMapUrl =
            this.$sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyC-0IZYk7mmRswHapPmWnSpMa6i2kHnP9I&q=' + event.address);
        }  

        this.updateExtraDisciplineAgeGroups();
      });

      this.birthYears = this.MembersService.getAllowedBirthYears();
    }

    updateDisciplines() {

      // Reset already selected disciplines
      _.each(this.registrationData.disciplines, discipline => {
        discipline.selected = false;
      }); 

      if (this.registrationData.birthYear) {
        var currentYear = new Date().getFullYear();
        var diff = currentYear - this.registrationData.birthYear;

        if (diff <= 7) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('7 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '7 år');
        }
        else if (diff <= 8) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('8 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '8 år');
        }
        else if (diff <= 9) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('9 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '9 år');
        }
        else if (diff <= 10) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('10 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '10 år');
        }
        else if (diff <= 11) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('11 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '11 år');
        }
        else if (diff <= 12) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('12 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '12 år');
        }
        else if (diff <= 13) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('13 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '13 år');
        }
        else if (diff <= 15) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('15 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '15 år');
        }
        else if (diff <= 17) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('17 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '17 år');
        }
        else if (diff <= 19) {
          this.registrationData.disciplines = this.getAgeGroupDisciplines('19 år');
          this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, '19 år');
        }
        else {
          if (this.registrationData.gender === 'female') {
            this.registrationData.disciplines = this.getAgeGroupDisciplines('K');
            this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, 'K');
          }
          if (this.registrationData.gender === 'male') {
            this.registrationData.disciplines = this.getAgeGroupDisciplines('M');
            this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, 'M');
          }
        }
      }
    }

    getAgeClass(gender: string, ageString: string) {
      if (!gender) {
        return null;
      }

      if (!ageString) {
        return null;
      }

      switch (ageString) {
        case '7 år': return gender === 'male' ? 'D7' : 'P7';
        case '8 år': return gender === 'male' ? 'D8' : 'P8';
        case '9 år': return gender === 'male' ? 'D9' : 'P9';
        case '10 år': return gender === 'male' ? 'D10' : 'P10';
        case '11 år': return gender === 'male' ? 'D11' : 'P11';
        case '12 år': return gender === 'male' ? 'D12' : 'P12';
        case '13 år': return gender === 'male' ? 'D13' : 'P13';
        case '15 år': return gender === 'male' ? 'D15' : 'P15';
        case '17 år': return gender === 'male' ? 'D17' : 'P17';
        case '19 år': return gender === 'male' ? 'D19' : 'P19';
        case 'K': return 'K';
        case 'M': return 'M';
        default: return null;
      }
    }

    // sets age groups to age groups where there are disciplines    
    updateExtraDisciplineAgeGroups() {
      this.ageGroups = _.map(_.filter(this.event.disciplines, discipline => discipline.disciplines.length > 0), discipline => {
        return discipline.ageGroup;
      });
    }

    // Age group will be something like "7 år", "8 år" etc.    
    getAgeGroupDisciplines(ageGroup) {
      var ageGroupDiscipline = _.find(this.event.disciplines, discipline => discipline.ageGroup === ageGroup);

      if (!ageGroupDiscipline) {
        return null;
      }      

      return ageGroupDiscipline.disciplines;
    }

    addExtraDiscipline() {
      if (!this.registrationData.extraDisciplines) {
        this.registrationData.extraDisciplines = [];
      }

      this.registrationData.extraDisciplines.push({});
    }

    removeExtraDiscipline(index: number) {
      this.registrationData.extraDisciplines.splice(index, 1);
    }

    onDataChange(registrationData: any) {
      this.validate(registrationData);
    }

    validate(registrationData: any) {
      if (!registrationData.name || registrationData.name.trim() === '') {
        this.registrationIsValid = false;
        this.validationError = 'Du har ikke angivet deltagerens navn';
        return;
      }

      if (!registrationData.gender || registrationData.gender.trim() === '') {
        this.registrationIsValid = false;
        this.validationError = 'Du har ikke angivet om deltageren er en pige eller en dreng';
        return;
      }

      if (!registrationData.birthYear) {
        this.registrationIsValid = false;
        this.validationError = 'Du skal angive deltagerens alder';
        return;
      }

      if (!registrationData.email || registrationData.email.trim() === '') {
        this.registrationIsValid = false;
        this.validationError = 'Du har ikke angivet din e-mail adresse';
        return;
      }

      if (!registrationData.recaptcha) {
        this.registrationIsValid = false;
        this.validationError = 'Du mangler at angive at du ikke er en robot';
        return;
      }

      this.registrationIsValid = true;
      this.validationError = null;      
    }

    validateDelayed() {
      this.$timeout(() => {
        this.validate(this.registrationData);
      }, 200);
    }
    
    register(registrationData: any) {
      this.alerts = [];
      this.registering = true;

      this.registration = this.buildRegistration(registrationData);

      this.SysEventsService.post('Event registration posting for email: ' + registrationData.email);
      this.EventsService.register(this.registration).then(data => {
        this.SysEventsService.post('Event registration succeeded for email:' + registrationData.email);
        this.registrationComplete = true;
      }).catch(err => {
        this.SysEventsService.post('Event registration failed for email ' + registrationData.email + ' with error: ' + err);
        this.alerts.push({ type: 'danger', msg: 'Hov, noget gik galt under din registrering. Prøv lige en gang til eller kontakt GIK.' });
      }).finally(() => {
        this.registering = false;
      });
    }

    buildRegistration(registrationData: any): Registration {
      var registration: Registration = {
        _id: null,
        eventId: this.event._id,
        name: registrationData.name,
        email: registrationData.email,
        birthYear: registrationData.birthYear,
        ageClass: registrationData.ageGroup,
        recaptcha: registrationData.recaptcha,
        disciplines: [],
        extraDisciplines: []
      };

      _.each(registrationData.disciplines, discipline => {
        if (discipline.selected) {
          registration.disciplines.push({
            id: discipline.id,
            name: discipline.name,
            personalRecord: discipline.personalRecord
          });
        }
      });

      _.each(registrationData.extraDisciplines, discipline => {
        registration.extraDisciplines.push({
          ageClass: this.getAgeClass(registrationData.gender, discipline.ageGroup),
          id: this.EventsService.findDisciplineIdByName(discipline.name),
          name: discipline.name,
          personalRecord: discipline.personalRecord
        });
      });

      return registration;
    }
  }
}

angular.module('events')
  .controller('EventRegisterController', events.EventRegisterController);
