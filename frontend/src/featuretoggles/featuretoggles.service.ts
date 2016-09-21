/// <reference path="../../typings/tsd.d.ts"/>

module featuretoggles {
    'use strict';

    export class FeatureTogglesService {

        static $inject = [];

        isMembersEnabled(): boolean { return false; }
    }
}

angular.module('featuretoggles')
    .service('FeatureTogglesService', featuretoggles.FeatureTogglesService);
