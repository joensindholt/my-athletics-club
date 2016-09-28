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
            return [
                { id: '40m', name: '40m', short: '40' },
                { id: '60m', name: '60m', short: '60' },
                { id: '80m', name: '80m', short: '80' },
                { id: '100m', name: '100m', short: '100' },
                { id: '200m', name: '200m', short: '200' },
                { id: '400m', name: '400m', short: '400' },
                { id: '600m', name: '600m', short: '600' },
                { id: '800m', name: '800m', short: '800' },
                { id: '1000m', name: '1000m', short: '1000' },
                { id: '1500m', name: '1500m', short: '1500' },
                { id: '3000m', name: '3000m', short: '3000' },
                { id: '5000m', name: '5000m', short: '5000' },
                { id: '40mHurdles', name: '40m hæk', short: '40H' },
                { id: '60mHurdles', name: '60m hæk', short: '60H' },
                { id: '80mHurdles', name: '80m hæk', short: '80H'},
                { id: '100mHurdles', name: '100m hæk', short: '100H' },
                { id: '110mHurdles', name: '110m hæk', short: '110H' },
                { id: '400mHurdles', name: '400m hæk', short: '400H' },
                { id: '4x40m', name: '4 x 40m stafet', short: '4x40' },
                { id: '4x60m', name: '4 x 60m stafet', short: '4x60' },
                { id: '4x80m', name: '4 x 80m stafet', short: '4x80' },
                { id: '4x100m', name: '4 x 100m stafet', short: '4x100' },
                { id: '4x400m', name: '4 x 400m stafet', short: '4x400' },
                { id: 'longjump', name: 'længdespring', short: 'LÆ' },
                { id: 'highjump', name: 'højdespring', short: 'HØ' },
                { id: 'shotput', name: 'kuglestød', short: 'KU' },
                { id: 'javelin', name: 'spydkast', short: 'SP' },
                { id: 'discusthrow', name: 'diskoskast', short: 'DI' },
                { id: 'hammerthrow', name: 'hammerkast', short: 'HA' },
                { id: 'weightthrow', name: 'vægtkast', short: 'VÆ' },
                { id: 'triplejump', name: 'trespring', short: 'TR' },
                { id: 'polevault', name: 'stangspring', short: 'ST' },
            ];
        }
    }
}

angular.module('events')
    .service('EventsService', events.EventsService);
