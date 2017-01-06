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

    getPublicEvents(): ng.IPromise<Array<Event>> {
      var deferred = this.$q.defer();

      this.getAll().then(events => {
        var now = new Date();

        var today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // events are public when the event end date has not yet passed
        var publicEvents = _.filter(events, event => {
          var eventEndDateOffset = new Date(event.date.getTime());
          eventEndDateOffset.setDate(eventEndDateOffset.getDate() + 1);
          var isActive = today < eventEndDateOffset;
          return isActive;
        });

        deferred.resolve(publicEvents);
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
        { id: '40', name: '40m' },
        { id: '60', name: '60m' },
        { id: '80', name: '80m' },
        { id: '100', name: '100m' },
        { id: '200', name: '200m' },
        { id: '400', name: '400m' },
        { id: '600', name: '600m' },
        { id: '800', name: '800m' },
        { id: '1000', name: '1000m' },
        { id: '1500', name: '1500m' },
        { id: '3000', name: '3000m' },
        { id: '5000', name: '5000m' },
        { id: '40H', name: '40m hæk' },
        { id: '60H', name: '60m hæk' },
        { id: '80H', name: '80m hæk' },
        { id: '100H', name: '100m hæk' },
        { id: '110H', name: '110m hæk' },
        { id: '400H', name: '400m hæk' },
        { id: '4x40', name: '4 x 40m stafet' },
        { id: '4x60', name: '4 x 60m stafet' },
        { id: '4x80', name: '4 x 80m stafet' },
        { id: '4x100', name: '4 x 100m stafet' },
        { id: '4x400', name: '4 x 400m stafet' },
        { id: 'LÆ', name: 'længdespring' },
        { id: 'HØ', name: 'højdespring' },
        { id: 'KU', name: 'kuglestød' },
        { id: 'SP', name: 'spydkast' },
        { id: 'DI', name: 'diskoskast' },
        { id: 'HA', name: 'hammerkast' },
        { id: 'VÆ', name: 'vægtkast' },
        { id: 'TR', name: 'trespring' },
        { id: 'ST', name: 'stangspring' },
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
      var classes = [];

      for (let i = 7; i <= 19; i++) {
        classes.push('P' + i);
      }
      classes.push('K');

      for (let i = 7; i <= 19; i++) {
        classes.push('D' + i);
      }
      classes.push('M');

      return classes;
    }

    getAgeGroups() {
      var ageGroups = [];
      for (let i = 7; i <= 19; i++) {
        ageGroups.push(i.toString());
      }
      ageGroups.push('K');
      ageGroups.push('M');

      return ageGroups;
    }
  }
}

angular.module('events')
  .service('EventsService', events.EventsService);
