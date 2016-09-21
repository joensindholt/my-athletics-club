/// <reference path="../../typings/tsd.d.ts"/>

module events {
    'use strict';

    export class EventsService {

        private API_PATH = globals.apiUrl;;

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
                { id: '40m', name: '40m' },
                { id: '60m', name: '60m' },
                { id: '100m', name: '100m' },
                { id: '200m', name: '200m' },
                { id: '300m', name: '300m' },
                { id: '400m', name: '400m' },
                { id: '800m', name: '800m' },
                { id: '1500m', name: '1500m' },
                { id: '3000m', name: '3000m' },
                { id: '5000m', name: '5000m' },
                { id: '2000mObstacle', name: '2000m forhindringsløb' },
                { id: '40mHurdles', name: '40m hæk' },
                { id: '60mHurdles', name: '60m hæk' },
                { id: '80mHurdles', name: '80m hæk' },
                { id: '100mHurdles', name: '100m hæk' },
                { id: '110mHurdles', name: '110m hæk' },
                { id: '400mHurdles', name: '400m hæk' },
                { id: '4x100m', name: '4 x 100m stafet' },
                { id: '4x400m', name: '4 x 400m stafet' },
                { id: 'longjump', name: 'længdespring' },
                { id: 'highjump', name: 'højdespring' },
                { id: 'shotput', name: 'kuglestød' },
                { id: 'javelin', name: 'spydkast' },
                { id: 'discusthrow', name: 'diskoskast' },
                { id: 'hammerthrow', name: 'hammerkast' },
                { id: 'weightthrow', name: 'vægtkast' },
                { id: 'triplejump', name: 'trespring' },
                { id: 'polevault', name: 'stangspring' },
            ];
        }
    }
}

angular.module('events')
    .service('EventsService', events.EventsService);
