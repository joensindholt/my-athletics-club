angular.module("templates", []).run(["$templateCache",
  function ($templateCache) {
    $templateCache.put("multiple-autocomplete-tpl.html", "<div class=\"multiple-autocomplete\"><div class=\"ng-ms form-item-container\">\r\n    <ul class=\"list-inline\">\r\n        <li ng-repeat=\"item in modelArr\">\r\n			<span ng-if=\"objectProperty == undefined || objectProperty == \'\'\">\r\n				{{item}} <span class=\"remove\" ng-click=\"removeAddedValues(item)\">\r\n                <i class=\"fa fa-times\"></i></span>&nbsp;\r\n			</span>\r\n            <span ng-if=\"objectProperty != undefined && objectProperty != \'\'\">\r\n				{{item[objectProperty]}} <span class=\"remove\" ng-click=\"removeAddedValues(item)\">\r\n                <i class=\"fa fa-times\"></i></span>&nbsp;\r\n			</span>\r\n        </li>\r\n        <li>\r\n            <input name=\"{{name}}\" ng-model=\"inputValue\" placeholder=\"\" ng-keydown=\"keyParser($event)\" ng-keyup=\"onKeyUp($event)\"\r\n                   err-msg-required=\"{{errMsgRequired}}\"\r\n                   ng-focus=\"onFocus()\" ng-blur=\"onBlur()\" ng-required=\"!modelArr.length && isRequired\"\r\n                    ng-change=\"onChange()\">\r\n        </li>\r\n    </ul>\r\n</div>\r\n<div class=\"autocomplete-list\" ng-show=\"isFocused || isHover\" ng-mouseenter=\"onMouseEnter()\" ng-mouseleave=\"onMouseLeave()\">\r\n    <ul ng-if=\"objectProperty == undefined || objectProperty == \'\'\">\r\n        <li ng-class=\"{\'autocomplete-active\' : selectedItemIndex == $index}\"\r\n            ng-repeat=\"suggestion in suggestionsArr | filter : inputValue | filter : alreadyAddedValues\"\r\n            ng-click=\"onSuggestedItemsClick(suggestion)\" ng-mouseenter=\"mouseEnterOnItem($index)\">\r\n            {{suggestion}}\r\n        </li>\r\n    </ul>\r\n    <ul ng-if=\"objectProperty != undefined && objectProperty != \'\'\">\r\n        <li ng-class=\"{\'autocomplete-active\' : selectedItemIndex == $index}\"\r\n            ng-repeat=\"suggestion in suggestionsArr | filter : inputValue | filter : alreadyAddedValues\"\r\n            ng-click=\"onSuggestedItemsClick(suggestion)\" ng-mouseenter=\"mouseEnterOnItem($index)\">\r\n            {{suggestion[objectProperty]}}\r\n        </li>\r\n    </ul>\r\n</div></div>");
  }]);
(function () {
  //declare all modules and their dependencies.
  angular.module('multipleSelect', [
    'templates'
  ]).config(function () {

  });
}
)();
(function () {

  angular.module('multipleSelect').directive('multipleAutocomplete', [
    '$filter',
    '$http',
    function ($filter, $http) {
      return {
        restrict: 'EA',
        scope: {
          suggestionsArr: '=?',
          modelArr: '=ngModel',
          apiUrl: '@',
          beforeSelectItem: '&',
          afterSelectItem: '&',
          beforeRemoveItem: '&',
          afterRemoveItem: '&',
          onDirectiveFocus: '&',
          clipboardDisciplines: '='
        },
        templateUrl: 'multiple-autocomplete-tpl.html',
        link: function (scope, element, attr) {
          scope.objectProperty = attr.objectProperty;
          scope.selectedItemIndex = 0;
          scope.name = attr.name;
          scope.isRequired = attr.required;
          scope.errMsgRequired = attr.errMsgRequired;
          scope.isHover = false;
          scope.isFocused = false;
          var getSuggestionsList = function () {
            var url = scope.apiUrl;
            $http({
              method: 'GET',
              url: url
            }).then(function (response) {
              scope.suggestionsArr = response.data;
            }, function (response) {
              console.log("*****Angular-multiple-select **** ----- Unable to fetch list");
            });
          };

          if (scope.suggestionsArr == null || scope.suggestionsArr == "") {
            if (scope.apiUrl != null && scope.apiUrl != "")
              getSuggestionsList();
            else {
              console.log("*****Angular-multiple-select **** ----- Please provide suggestion array list or url");
            }
          }

          if (scope.modelArr == null || scope.modelArr == "") {
            scope.modelArr = [];
          }
          scope.onFocus = function () {
            if (scope.onDirectiveFocus)
              scope.onDirectiveFocus({ disciplines: scope.modelArr });
          };

          scope.onMouseEnter = function () {
            scope.isHover = true;
          };

          scope.onMouseLeave = function () {
            scope.isHover = false;
          };

          scope.onBlur = function () {
            scope.isFocused = false;
          };

          scope.onChange = function () {
            scope.selectedItemIndex = 0;
          };

          scope.onKeyUp = function ($event) {
            var ctrl = 17;
            if ($event.keyCode === ctrl) {
              scope.ctrlDown = false;
            }
          }

          scope.keyParser = function ($event) {
            var keys = {
              38: 'up',
              40: 'down',
              8: 'backspace',
              13: 'enter',
              9: 'tab',
              27: 'esc',
              188: 'comma',
              17: 'ctrl',
              86: 'v'
            };

            var key = keys[$event.keyCode];
            if (key == 'ctrl') {
              scope.ctrlDown = true;
            }

            if (scope.ctrlDown) {
              if (key == 'v' && scope.clipboardDisciplines) {
                _.each(scope.clipboardDisciplines, d => {
                  if (!_.some(scope.modelArr, m => (<any>m).id == d.id)) {
                    scope.modelArr.push(d);
                  }
                });

                $event.preventDefault();
                scope.afterSelectItem();
              }

              return;
            }

            if (key == 'backspace' && !scope.inputValue) {
              if (scope.modelArr.length != 0) {
                scope.removeAddedValues(scope.modelArr[scope.modelArr.length - 1]);
              }
            }
            else if (key == 'down') {
              scope.isFocused = true;
              var filteredSuggestionArr = $filter('filter')(scope.suggestionsArr, scope.inputValue);
              filteredSuggestionArr = $filter('filter')(filteredSuggestionArr, scope.alreadyAddedValues);
              if (scope.selectedItemIndex < filteredSuggestionArr.length - 1)
                scope.selectedItemIndex++;
            }
            else if (key == 'up' && scope.selectedItemIndex > 0) {
              scope.isFocused = true;
              scope.selectedItemIndex--;
            }
            else if (key == 'esc') {
              scope.isHover = false;
              scope.isFocused = false;
            }
            else if (key == 'enter' || (key == 'tab' && scope.isFocused)) {
              var filteredSuggestionArr = $filter('filter')(scope.suggestionsArr, scope.inputValue);
              filteredSuggestionArr = $filter('filter')(filteredSuggestionArr, scope.alreadyAddedValues);
              if (scope.selectedItemIndex < filteredSuggestionArr.length)
                scope.onSuggestedItemsClick(filteredSuggestionArr[scope.selectedItemIndex]);
              else
                scope.selectUnknownElement();

              scope.isFocused = false;
              $event.preventDefault();
            }
            else if (key == 'comma') {
              scope.selectUnknownElement();
              $event.preventDefault();
            }
            else if (scope.isNumberOrCharacter($event.keyCode)) {
              scope.isFocused = true;
            }
          };

          scope.isNumberOrCharacter = function (keycode) {
            return (keycode > 47 && keycode < 58) || // Numbers
              (keycode > 64 && keycode < 91) || // characters
              (keycode > 95 && keycode < 112);  // Numpad keys 
          }

          scope.selectUnknownElement = function () {
            var value = scope.inputValue;
            var valueObject = { id: -1 };
            valueObject[scope.objectProperty] = value;
            scope.onSuggestedItemsClick(valueObject);
          }

          scope.onSuggestedItemsClick = function (selectedValue) {
            if (scope.beforeSelectItem && typeof (scope.beforeSelectItem) == 'function')
              scope.beforeSelectItem(selectedValue);

            scope.modelArr.push(selectedValue);
            if (scope.afterSelectItem)
              scope.afterSelectItem();
            scope.inputValue = "";
          };

          var isDuplicate = function (arr, item) {
            var duplicate = false;
            if (arr == null || arr == "")
              return duplicate;

            for (var i = 0; i < arr.length; i++) {
              duplicate = angular.equals(arr[i], item);
              if (duplicate)
                break;
            }
            return duplicate;
          };

          scope.alreadyAddedValues = function (item) {
            var isAdded = true;
            isAdded = !isDuplicate(scope.modelArr, item);
            return isAdded;
          };

          scope.removeAddedValues = function (item) {
            if (scope.modelArr != null && scope.modelArr != "") {
              var itemIndex = scope.modelArr.indexOf(item);
              if (itemIndex != -1) {
                if (scope.beforeRemoveItem && typeof (scope.beforeRemoveItem) == 'function')
                  scope.beforeRemoveItem(item);

                scope.modelArr.splice(itemIndex, 1);

                if (scope.afterRemoveItem)
                  scope.afterRemoveItem();
              }
            }
          };

          scope.mouseEnterOnItem = function (index) {
            scope.selectedItemIndex = index;
          };
        }
      };
    }
  ]);
})();