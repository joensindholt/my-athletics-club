/// <reference path="../../typings/tsd.d.ts"/>

module events {
  'use strict';

  export class EventsService {

    private API_PATH = globals.apiUrl;

    private events: Array<Event>;
    private getAllPromise: ng.IPromise<{}>;

    static $inject = ['$http', '$q'];

    constructor(
      private $http: ng.IHttpService,
      private $q: ng.IQService
    ) {
    }

    getAll(): ng.IPromise<Array<Event>> {

      if (this.getAllPromise) {
        return this.getAllPromise;
      }

      var deferred = this.$q.defer();
      // if we have cached events - use those 
      if (this.events) {
        deferred.resolve(this.events);
        return deferred.promise;
      }
      // ... else get from server
      this.$http.get(this.API_PATH + '/events').then(response => {
        // put in cache
        this.events = _.map(<Array<any>>response.data, (eventData) => {
          return new Event(eventData);
        });
        // ... and return
        deferred.resolve(this.events)
      }).catch(err => {
        deferred.reject(err);
      });

      this.getAllPromise = deferred.promise;

      return this.getAllPromise;
    }

    getEventsOpenForRegistration(): ng.IPromise<Array<Event>> {
      var deferred = this.$q.defer();

      this.getAll().then(events => {
        var now = new Date();
        var eventsOpenForRegistration = _.filter(events, event => {
          // get date one day after enddate
          var registrationPeriodEndDateOffset = event.registrationPeriodEndDate;
          registrationPeriodEndDateOffset.setDate(event.registrationPeriodEndDate.getDate() + 1);

          // check if today is within registration period using offset end date
          var isOpen = event.registrationPeriodStartDate <= now && now <= registrationPeriodEndDateOffset;
          if (!isOpen) {
            return false;
          }

          // check if event is before today
          var isBeforeToday = event.date <= now;
          if (isBeforeToday) {
            return false;
          }

          return true;
        });
        deferred.resolve(eventsOpenForRegistration);
      }).catch(err => {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    add(event: Event): ng.IPromise<Event> {
      var deferred = this.$q.defer();
      // give it a temporary id
      event._id = '-1';
      // ... and post to server
      this.$http.post(this.API_PATH + '/events', event)
        .then(response => {
          var newEvent = new Event(response.data);
          this.events.push(newEvent);
          deferred.resolve(newEvent)
        }).catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    get(id: string): ng.IPromise<Event> {
      var deferred = this.$q.defer();

      this.getAll().then(events => {
        const event = _.find(events, { _id: id });
        deferred.resolve(event);
      }).catch(err => {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    update(event: Event): ng.IPromise<Event> {
      var deferred = this.$q.defer();

      this.$http.post(this.API_PATH + '/events/' + event._id, event).then(response => {
        deferred.resolve();
      }).catch(err => {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    delete(event: Event): ng.IPromise<Event> {
      var deferred = this.$q.defer();
      // remove from cached list
      _.remove(this.events, e => e._id === event._id);
      // ... and delete from server
      this.$http.delete(this.API_PATH + '/events/' + event._id).then(response => {
        deferred.resolve();
      }).catch(err => {
        // re-add to list if error occured
        this.events.push(event);
        // ... and reject
        deferred.reject(err);
      })

      return deferred.promise;
    }

    register(registration: Registration): ng.IHttpPromise<any> {
      return this.$http.post(this.API_PATH + '/registrations', registration);
    }

    getRegistrations(id: string): ng.IPromise<Array<Registration>> {
      var deferred = this.$q.defer();

      this.$http.get(`${this.API_PATH}/events/${id}/registrations`).then((response) => {
        const registrations = _.map(<Array<any>>response.data, registrationData => { return new Registration(registrationData); });
        deferred.resolve(registrations);
      }).catch(err => {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    getAllDisciplines() {
      var disciplines = [
        { name: '40m', id: '40' },
        { name: '60m', id: '60' },
        { name: '80m', id: '80' },
        { name: '100m', id: '100' },
        { name: '200m', id: '200' },
        { name: '400m', id: '400' },
        { name: '600m', id: '600' },
        { name: '800m', id: '800' },
        { name: '1000m', id: '1000' },
        { name: '1500m', id: '1500' },
        { name: '3000m', id: '3000' },
        { name: '5000m', id: '5000' },
        { name: '40m hæk', id: '40H' },
        { name: '60m hæk', id: '60H' },
        { name: '80m hæk', id: '80H' },
        { name: '100m hæk', id: '100H' },
        { name: '110m hæk', id: '110H' },
        { name: '400m hæk', id: '400H' },
        { name: '4 x 40m stafet', id: '4x40' },
        { name: '4 x 60m stafet', id: '4x60' },
        { name: '4 x 80m stafet', id: '4x80' },
        { name: '4 x 100m stafet', id: '4x100' },
        { name: '4 x 400m stafet', id: '4x400' },
        { name: 'længdespring', id: 'LÆ' },
        { name: 'højdespring', id: 'HØ' },
        { name: 'kuglestød', id: 'KU' },
        { name: 'spydkast', id: 'SP' },
        { name: 'diskoskast', id: 'DI' },
        { name: 'hammerkast', id: 'HA' },
        { name: 'vægtkast', id: 'VÆ' },
        { name: 'trespring', id: 'TR' },
        { name: 'stangspring', id: 'ST' },
      ];

      return disciplines;
    }

    findDisciplineIdByName(name: string): string {
      var discipline = _.find(this.getAllDisciplines(), { name: name });
      if (discipline) {
        return discipline.id;
      }

      return null;
    }

    getAgeClasses() {
      var classes = [{ name: 'P7' }, { name: 'P8' }, { name: 'P9' }, { name: 'P10' }, { name: 'P11' }, { name: 'P12' }, { name: 'P13' },
          { name: 'P15' }, { name: 'P17' }, { name: 'P19' }, { name: 'K' }, { name: 'D7' }, { name: 'D8' }, { name: 'D9' }, { name: 'D10' }, { name: 'D11' }, { name: 'D12' }, { name: 'D13' },
          { name: 'D15' }, { name: 'D17' }, { name: 'D19' }, { name: 'M' }]
 
      return classes;      
    }

    getAgeGroups() {
      return ['7 år', '8 år', '9 år', '10 år', '11 år', '12 år', '13 år', '15 år', '17 år', '19 år', 'K', 'M']; 
    }
  }
}

angular.module('events')
  .service('EventsService', events.EventsService);
