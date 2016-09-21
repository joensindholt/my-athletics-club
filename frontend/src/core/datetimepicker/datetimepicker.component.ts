/// <reference path="../../../typings/tsd.d.ts"/>

module core {
    export function datetimepicker() {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                // initialize the datetimepicker
                var datetimepicker = elem.datetimepicker({
                    locale: 'da',
                    format: 'DD-MM-YYYY',
                    icons: {
                        next: 'fa fa-angle-right',
                        previous: 'fa fa-angle-left'
                    }
                });
                // update model value on selecting a date
                datetimepicker.on('dp.change', (event) => {
                    scope.$apply(function () {
                        ngModel.$setViewValue(event.date.format('YYYY/MM/DD'));
                    });
                });
            }
        };
    }
}

angular.module('core')
    .directive('dlDatetimepicker', core.datetimepicker);
