/// <reference path="../../../../typings/tsd.d.ts"/>

module core {
    export var disciplineBatch = {
        templateUrl: '/core/components/discipline-batch/discipline-batch.html',
        bindings: {
            discipline: '=',
            ageClass: '='
        },
        controller: function() {
            this.getAgeClass = () => {
                return this.discipline.ageClass || this.ageClass;
            }
        }
    }
}

angular.module('core')
    .component('disciplineBatch', core.disciplineBatch);

