/// <reference path="../../../typings/tsd.d.ts"/>

module core {
    export function editablefield() {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {},
            link: function (scope, elm, attr, ngModel) {
                // Mark the element with the contenteditable attribute
                attr.$set('contenteditable', true);

                // Update view value on keyup                
                function updateViewValue() {
                    ngModel.$setViewValue(this.innerHTML);
                }

                elm.on('keyup', updateViewValue);

                scope.$on('$destroy', function () {
                    elm.off('keyup', updateViewValue);
                });

                // display the model value                
                ngModel.$render = function () {
                    elm.html(ngModel.$viewValue);
                }

            }
        }
    }
}

angular.module('core')
    .directive('editablefield', core.editablefield);
