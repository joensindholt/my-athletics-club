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
    private validationErrors: Array<string>;
    private canSelectMoreDisciplines: boolean = true;
    private eventHasDisciplines: boolean = false;

    static $inject = [
      '$scope',
      '$state',
      '$window',
      '$sce',
      '$timeout',
      'moment',
      'EventsService',
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
      private MembersService: members.MembersService
    ) {
      if (!$state.params.id) {
        $state.go('home');
        return;
      }

      this.EventsService.get($state.params.id).then(event => {
        this.event = event;

        if (event.address) {
          this.trustedMapUrl =
            this.$sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyC-0IZYk7mmRswHapPmWnSpMa6i2kHnP9I&q=' + event.address);
        }

        this.eventHasDisciplines = this.event.disciplines.filter(d => d.disciplines.length > 0).length > 0;

        this.updateExtraDisciplineAgeGroups();
      });

      this.birthYears = this.MembersService.getAllowedBirthYears();

      // Show email receipt message until - not including - the given expire date
      var expireDate = new Date('2018-04-01'); 
      var now = new Date();
      if (now <= expireDate) {
        setTimeout(() => {
          toastr.info(
            'Når du har gennemført din tilmelding modtager du en bekræftelses-e-mail. Modtager du - mod forventning - ikke denne e-mail bør du kontakte os.<br /><br /><button type="button" class="btn clear o-button--default">OK, det er forstået</button>', 
            'Vi har tilføjet e-mail-bekræftelse ved tilmelding',
            { timeOut: 0, extendedTimeOut: 0, positionClass: "toast-top-center registration-toast" });
        }, 2000);
      };
    }

    updateDisciplines() {

      // Reset already selected disciplines
      _.each(this.registrationData.disciplines, discipline => {
        discipline.selected = false;
      });

      // Reset registration data
      this.registrationData.disciplines = [];
      this.registrationData.ageGroup = null;

      if (this.registrationData.birthYear) {
        var eventYear = this.event.date.getFullYear();
        var diff = eventYear - this.registrationData.birthYear;

        // run through age groups looking for disciplines
        var foundAgeGroupWithDisciplines = false;
        for (let i = diff; i <= 19; i++) {
          var ageGroupDisciplines = this.getAgeGroupDisciplines(i.toString());
          if (ageGroupDisciplines && ageGroupDisciplines.length > 0) {
            this.registrationData.disciplines = ageGroupDisciplines;
            this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, i.toString());
            foundAgeGroupWithDisciplines = true;
            break;
          }
        }

        // If none were found in regular age search look for grown up disciplines        
        if (!foundAgeGroupWithDisciplines) {
          if (this.registrationData.gender === 'female') {
            var ageGroupDisciplines = this.getAgeGroupDisciplines('K');
            if (ageGroupDisciplines && ageGroupDisciplines.length > 0) {
              this.registrationData.disciplines = ageGroupDisciplines;
              this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, 'K');
            }
          }
          if (this.registrationData.gender === 'male') {
            var ageGroupDisciplines = this.getAgeGroupDisciplines('M');
            if (ageGroupDisciplines && ageGroupDisciplines.length > 0) {
              this.registrationData.disciplines = ageGroupDisciplines;
              this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, 'M');
            }
          }
        }
      }
    }

    // Given a gender (male of female) and a ageString (7, 8, 9, ....,  19, K, M)
    // Returns the age classification like D7, P7, D8, ...
    getAgeClass(gender: string, ageString: string) {
      if (!gender) {
        return null;
      }

      if (!ageString) {
        return null;
      }

      switch (ageString) {
        case 'K': return 'K';
        case 'M': return 'M';
        default: return gender === 'male' ? 'D' + ageString : 'P' + ageString;
      }
    }

    // sets age groups to age groups where there are disciplines    
    updateExtraDisciplineAgeGroups() {
      this.ageGroups = _.map(_.filter(this.event.disciplines, discipline => discipline.disciplines.length > 0), discipline => {
        return discipline.ageGroup;
      });
    }

    // Age group will be something like "7", "8" etc.    
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
      this.updateCanSelectMoreDisciplines(); 
    }

    removeExtraDiscipline(index: number) {
      this.registrationData.extraDisciplines.splice(index, 1);
      this.updateCanSelectMoreDisciplines(); 
      this.validate(this.registrationData);      
    }

    onDataChange(registrationData: any) {
      this.validate(registrationData);
    }

    toggleDiscipline(discipline: any) {
      discipline.selected = !discipline.selected;
      this.updateCanSelectMoreDisciplines();
    }

    updateCanSelectMoreDisciplines() {
      var selectedDisciplinesCount = _.filter(this.registrationData.disciplines, { selected: true }).length;
      var extraDisciplinesCount = this.registrationData.extraDisciplines ? this.registrationData.extraDisciplines.length : 0;
      this.canSelectMoreDisciplines = selectedDisciplinesCount + extraDisciplinesCount < this.event.maxDisciplinesAllowed;
    }

    validate(registrationData: any) {

      this.registrationIsValid = true;
      this.validationErrors = [];

      if (!registrationData.name || registrationData.name.trim() === '') {
        this.registrationIsValid = false;
        this.validationErrors.push('Angive deltagerens navn');
      }

      if (!registrationData.gender || registrationData.gender.trim() === '') {
        this.registrationIsValid = false;
        this.validationErrors.push('Angive om deltageren er en pige eller en dreng');
      }

      if (!registrationData.birthYear) {
        this.registrationIsValid = false;
        this.validationErrors.push('Angive deltagerens alder');
      }

      if (!registrationData.email || registrationData.email.trim() === '') {
        this.registrationIsValid = false;
        this.validationErrors.push('Angive din e-mail adresse');
      }

      // ensure at least on displine selected if the event itself has any disciplines
      if (this.eventHasDisciplines) {
        var hasSelectedDiscipline = registrationData.disciplines && registrationData.disciplines.filter(d => d.selected).length > 0; 
        var hasSelectedExtraDiscipline = registrationData.extraDisciplines && registrationData.extraDisciplines.length > 0;
        
        if (!hasSelectedDiscipline && !hasSelectedExtraDiscipline) {
          this.registrationIsValid = false;
          this.validationErrors.push('Angive hvilke discipliner der stilles op i');
        }
      }

      if (!registrationData.recaptcha) {
        this.registrationIsValid = false;
        this.validationErrors.push('Angive at du ikke er en robot');
      }
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

      this.EventsService.register(this.registration).then(data => {
        this.registrationComplete = true;
      }).catch(err => {
        this.alerts.push({ type: 'danger', msg: 'Hov, noget gik galt under din registrering. Prøv lige en gang til eller kontakt GIK.' });
      }).finally(() => {
        this.registering = false;
      });
    }

    buildRegistration(registrationData: any): Registration {
      var registration: Registration = {
        id: null,
        eventId: this.event.id,
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
