/// <reference path="../../../typings/tsd.d.ts"/>

module core {
    'use strict';

    export class HomeController {

        static $inject = [
            '$scope',
            '$state',
            'EventsService'
        ];

        constructor(
            private $scope: any,
            private $state: ng.ui.IStateService,
            private EventsService: events.EventsService
        ) {
            if (!this.$scope.isAuthenticated) {
                this.EventsService.getEventsOpenForRegistration().then(events => {
                    if (events.length === 1) {
                        console.log('found 1 event. showing that one');
                        var eventId = events[0]._id;
                        this.$state.go('events_register', { id: eventId });
                    }
                    else {
                        console.log('found <>1 event. showing event list');
                        this.$state.go('events');
                    }
                })
            }
            else {
                this.$state.go('events');
            }    
        }
    }
}

angular.module('core')
    .controller('HomeController', core.HomeController);
