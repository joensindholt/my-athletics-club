/// <reference path="../../../typings/tsd.d.ts"/>

module core {
    'use strict';

    export class HomeController {

        static $inject = [
            '$state'
        ];

        constructor(
            private $state: ng.ui.IStateService
        ) {
            this.$state.go('events');
        }
    }
}

angular.module('core')
    .controller('HomeController', core.HomeController);
