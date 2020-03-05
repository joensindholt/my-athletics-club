var SentryConfig = (function () {
    function SentryConfig() {
        var _this = this;
        this.ignoreUrls = [
            // Chrome extensions
            /extensions\//i,
            /^chrome:\/\//i
        ];
        this.configure = function () {
            var ravenOptions = {
                release: 1,
                shouldSendCallback: function (data) {
                    return globals.sentryErrors;
                },
                ignoreUrls: _this.ignoreUrls
            };
            Raven.config('https://2a92c58d79ae46b982f859c4d54c7474@sentry.io/98130', ravenOptions)
                .addPlugin(Raven.Plugins.Angular)
                .install();
        };
    }
    return SentryConfig;
}());
// taken from http://jameshill.io/articles/angular-third-party-injection-pattern/
angular.module('momentjs', [])
    .factory('moment', function ($window) {
    if ($window.moment) {
        //Delete moment from window so it's not globally accessible.
        //  We can still get at it through _thirdParty however, more on why later
        $window._thirdParty = $window._thirdParty || {};
        $window._thirdParty.moment = $window.moment;
        try {
            delete $window.moment;
        }
        catch (e) {
            $window.moment = undefined;
        }
    }
    var moment = $window._thirdParty.moment;
    return moment;
});
/// <reference path="../../typings/tsd.d.ts"/>
var globals;
(function (globals) {
    globals.apiUrl = 'https://myathleticsclubapi.azurewebsites.net/api';
    globals.apiDomain = 'myathleticsclubapi.azurewebsites.net';
    globals.sentryErrors = true;
})(globals || (globals = {}));
/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="core/sentry.ts"/>
/// <reference path="core/moment/moment.ts"/>
/// <reference path="core/globals.ts"/>
// SENTRY - needs to be the first thing going on
new SentryConfig().configure();
var app;
(function (app) {
    'use strict';
    angular
        .module('app', [
        // External modules
        'ngRoute',
        'ui.router',
        // App modules
        'core',
        'events',
        'featuretoggles',
        'members',
        'Registrations',
        'users',
        // Third party modules
        'ngRaven',
        'momentjs',
        'checklist-model',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.bootstrap.datepickerPopup',
        'vcRecaptcha',
        'angular-autogrow',
        'multipleSelect',
        'cfp.hotkeys',
        'ngCsv',
        'chart.js'
    ])
        .config(['$stateProvider', '$httpProvider', config])
        .run(['AuthService', run]);
    angular.module('core', ['ngSanitize']);
    angular.module('events', []);
    angular.module('members', []);
    angular.module('Registrations', []);
    angular.module('users', []);
    angular.module('featuretoggles', []);
    function config($stateProvider, $httpProvider) {
        $stateProvider
            .state('home', {
            url: '',
            templateUrl: 'core/home/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
            .state('events', {
            url: '/events',
            templateUrl: 'events/events.html',
            controller: 'EventsController',
            controllerAs: 'vm'
        })
            .state('events_edit', {
            url: '/events/{id}/edit',
            templateUrl: 'events/event.edit.html',
            controller: 'EventEditController',
            controllerAs: 'vm'
        })
            .state('events_register', {
            url: '/events/{id}',
            templateUrl: 'events/event.register.html',
            controller: 'EventRegisterController',
            controllerAs: 'vm'
        })
            .state('login', {
            url: '/login',
            templateUrl: 'users/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
            .state('logout', {
            url: '/logout',
            templateUrl: 'users/logout.html',
            controller: 'LogoutController',
            controllerAs: 'vm'
        })
            .state('members', {
            url: '/members',
            templateUrl: 'members/members.html',
            controller: 'MembersController',
            controllerAs: 'vm'
        })
            .state('members_add', {
            url: '/members/add',
            templateUrl: 'members/member.add.html',
            controller: 'MemberAddController',
            controllerAs: 'vm'
        })
            .state('members_edit', {
            url: '/members/edit/{id}',
            templateUrl: 'members/member.edit.html',
            controller: 'MemberEditController',
            controllerAs: 'vm'
        })
            .state('members_stats', {
            url: '/members/statistics',
            templateUrl: 'members/member.statistics.html',
            controller: 'MemberStatisticsController',
            controllerAs: 'vm'
        })
            .state('members_terminated', {
            url: '/members/terminated',
            templateUrl: 'members/terminated/terminated-members.html',
            controller: 'TerminatedMembersController',
            controllerAs: 'vm'
        });
        $httpProvider.interceptors.push('tokenInterceptor');
    }
    function run(authService) {
        var isLoggedIn = authService.checkLoginStatus();
        console.log('App running', isLoggedIn);
    }
})(app || (app = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var core;
(function (core) {
    'use strict';
    var DateService = (function () {
        function DateService() {
        }
        DateService.prototype.parseServerDate = function (dateString) {
            if (!dateString) {
                return null;
            }
            return new Date(dateString);
        };
        DateService.prototype.parseAsCopenhagenDate = function (dateString) {
            // If we get a date with timezone we ignore it by removing the time zone indicator
            if (dateString[dateString.length - 1] === 'Z') {
                dateString = dateString.substring(0, dateString.length - 1);
            }
            return new Date(dateString + '+' + this.getTimezoneOffsetString());
        };
        DateService.prototype.getTimezoneOffsetString = function () {
            var timezoneOffset = new Date().getTimezoneOffset();
            if (timezoneOffset === -120) {
                return '0200';
            }
            else if (timezoneOffset === -60) {
                return '0100';
            }
            throw new Error('Could not resolve timezone offset string');
        };
        return DateService;
    }());
    core.DateService = DateService;
})(core || (core = {}));
angular.module('core')
    .service('DateService', core.DateService);
/// <reference path="../../../../typings/tsd.d.ts"/>
var core;
(function (core) {
    core.disciplineBatch = {
        templateUrl: '/core/components/discipline-batch/discipline-batch.html',
        bindings: {
            discipline: '=',
            ageClass: '='
        },
        controller: function () {
            var _this = this;
            this.getAgeClass = function () {
                return _this.discipline.ageClass || _this.ageClass;
            };
        }
    };
})(core || (core = {}));
angular.module('core')
    .component('disciplineBatch', core.disciplineBatch);
/// <reference path="../../../typings/tsd.d.ts"/>
var core;
(function (core) {
    function datetimepicker() {
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
                datetimepicker.on('dp.change', function (event) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(event.date.format('YYYY/MM/DD'));
                    });
                });
            }
        };
    }
    core.datetimepicker = datetimepicker;
})(core || (core = {}));
angular.module('core')
    .directive('dlDatetimepicker', core.datetimepicker);
/// <reference path="../../../typings/tsd.d.ts"/>
var core;
(function (core) {
    function editablefield() {
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
                };
            }
        };
    }
    core.editablefield = editablefield;
})(core || (core = {}));
angular.module('core')
    .directive('editablefield', core.editablefield);
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
})();
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
                    };
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
                                _.each(scope.clipboardDisciplines, function (d) {
                                    if (!_.some(scope.modelArr, function (m) { return m.id == d.id; })) {
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
                        return (keycode > 47 && keycode < 58) ||
                            (keycode > 64 && keycode < 91) ||
                            (keycode > 95 && keycode < 112); // Numpad keys 
                    };
                    scope.selectUnknownElement = function () {
                        var value = scope.inputValue;
                        var valueObject = { id: -1 };
                        valueObject[scope.objectProperty] = value;
                        scope.onSuggestedItemsClick(valueObject);
                    };
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
/// <reference path="../../../typings/tsd.d.ts"/>
var core;
(function (core) {
    function formatdate(moment) {
        return function (input, format) {
            // use danish locale
            moment.locale('da');
            // default to danish short date format
            format = format || 'LL';
            // use moment to parse date
            var date = moment(input, 'YYYY/MM/DD');
            return date.format(format);
        };
    }
    core.formatdate = formatdate;
})(core || (core = {}));
angular.module('core')
    .filter('formatdate', ['moment', core.formatdate]);
/// <reference path="../../../typings/tsd.d.ts"/>
var core;
(function (core) {
    'use strict';
    var HomeController = (function () {
        function HomeController($state) {
            this.$state = $state;
            this.$state.go('events');
        }
        HomeController.$inject = [
            '$state'
        ];
        return HomeController;
    }());
    core.HomeController = HomeController;
})(core || (core = {}));
angular.module('core')
    .controller('HomeController', core.HomeController);
/// <reference path="../../../typings/tsd.d.ts"/>
var core;
(function (core) {
    function topbar() {
        return {
            bindings: {},
            controller: core.TopBarController,
            controllerAs: 'vm',
            templateUrl: "core/topbar/topbar.html",
            restrict: 'E',
            replace: true
        };
    }
    core.topbar = topbar;
    var TopBarController = (function () {
        function TopBarController($state, $rootScope, AuthService, FeatureTogglesService) {
            this.$state = $state;
            this.$rootScope = $rootScope;
            this.AuthService = AuthService;
            this.FeatureTogglesService = FeatureTogglesService;
            this.init();
        }
        TopBarController.prototype.init = function () {
            var _this = this;
            this.$rootScope.$watch('isAuthenticated', function (value) {
                _this.isAuthenticated = value;
            });
            this.isMembersEnabled = this.FeatureTogglesService.isMembersEnabled();
        };
        TopBarController.prototype.logout = function () {
            this.AuthService.logout();
            this.$state.go('home');
        };
        TopBarController.$inject = [
            '$state',
            '$rootScope',
            'AuthService',
            'FeatureTogglesService',
        ];
        return TopBarController;
    }());
    core.TopBarController = TopBarController;
})(core || (core = {}));
angular.module('core')
    .component('topbar', core.topbar());
var events;
(function (events) {
    var Event = (function () {
        function Event(eventData, dateService) {
            this.id = eventData._id || eventData.id || -1;
            this.title = eventData.title || 'Nyt stævne';
            this.date = eventData.date ? dateService.parseServerDate(eventData.date) : new Date();
            this.endDate = eventData.endDate ? dateService.parseServerDate(eventData.endDate) : null;
            this.address = eventData.address || 'Ved Stadion 6\n2820 Gentofte';
            this.link = eventData.link;
            this.disciplines = eventData.disciplines || [];
            this.info = eventData.info;
            this.maxDisciplinesAllowed = eventData.maxDisciplinesAllowed || 3;
            this.isOldEvent = eventData.isOldEvent;
            this.registrationPeriodStartDate = null;
            if (eventData.registrationPeriodStartDate) {
                this.registrationPeriodStartDate = dateService.parseServerDate(eventData.registrationPeriodStartDate);
            }
            this.registrationPeriodEndDate = null;
            if (eventData.registrationPeriodEndDate) {
                this.registrationPeriodEndDate = dateService.parseServerDate(eventData.registrationPeriodEndDate);
            }
            // reset time on dates 
            if (this.date) {
                this.date = this.resetTimePart(this.date);
            }
            if (this.endDate) {
                this.endDate = this.resetTimePart(this.endDate);
            }
            if (this.registrationPeriodStartDate) {
                this.registrationPeriodStartDate = this.resetTimePart(this.registrationPeriodStartDate);
            }
            if (this.registrationPeriodEndDate) {
                this.registrationPeriodEndDate = this.resetTimePart(this.registrationPeriodEndDate);
            }
            // is event open for registration?
            if (this.registrationPeriodEndDate && this.registrationPeriodStartDate) {
                var now = new Date();
                var registrationPeriodEndDateOffset = new Date(this.registrationPeriodEndDate.getTime());
                registrationPeriodEndDateOffset.setDate(registrationPeriodEndDateOffset.getDate() + 1);
                this.isOpenForRegistration = this.registrationPeriodStartDate <= now && now <= registrationPeriodEndDateOffset;
            }
            else {
                this.isOpenForRegistration = false;
            }
        }
        Event.prototype.resetTimePart = function (date) {
            date.setHours(0, 0, 0, 0);
            return date;
        };
        return Event;
    }());
    events.Event = Event;
})(events || (events = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var events;
(function (events) {
    'use strict';
    var EventEditController = (function () {
        function EventEditController($scope, $state, $window, $document, $sce, $timeout, $element, moment, EventsService, AuthService, hotkeys) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$window = $window;
            this.$document = $document;
            this.$sce = $sce;
            this.$timeout = $timeout;
            this.$element = $element;
            this.moment = moment;
            this.EventsService = EventsService;
            this.AuthService = AuthService;
            this.hotkeys = hotkeys;
            this.datePickerOptions = {
                startingDay: 1
            };
            if (!$state.params.id) {
                $state.go('home');
                return;
            }
            if (!AuthService.isAuthenticated) {
                $state.go('events_register', { id: $state.params.id });
                return;
            }
            // load default available disciplines      
            this.availableDisciplines = this.EventsService.getAllDisciplines();
            // load age groups      
            this.ageGroups = this.EventsService.getAgeGroups();
            // get event...
            this.EventsService.get($state.params.id).then(function (event) {
                // init controller event
                _this.event = event;
                // init event disciplines
                _this.updateDisciplines(_this.event);
                // resolve excel download url
                _this.updateExcelDownloadUrl();
                if (!_this.event.registrationPeriodStartDate) {
                    _this.event.registrationPeriodStartDate = new Date();
                }
                if (!_this.event.registrationPeriodEndDate) {
                    _this.event.registrationPeriodEndDate = new Date();
                }
            });
            // get event registrations      
            this.EventsService.getRegistrations($state.params.id).then(function (registrations) {
                // init controller registrations - ordered by name
                _this.registrations = _.orderBy(registrations, ['timestamp']);
            });
            hotkeys.add({
                combo: 'ctrl+c',
                description: 'Kopier discipliner',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function (e) {
                    if (_this.currentlyFocusedDisciplines) {
                        _this.copyDisciplinesToClipboard(_this.currentlyFocusedDisciplines);
                    }
                }
            });
            hotkeys.add({
                combo: 'ctrl+s',
                description: 'Gem ændringer',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function (e) {
                    _this.saveNow(_this.event);
                    e.preventDefault();
                }
            });
        }
        EventEditController.prototype.onDisciplineSelectFocus = function (disciplines) {
            this.currentlyFocusedDisciplines = disciplines;
        };
        EventEditController.prototype.updateDisciplines = function (event) {
            // make sure we have at least an empty 
            // set of disciplines on the event
            if (!event.disciplines) {
                event.disciplines = [];
            }
            // create new sanitized list of disciplines with all agegroups
            var sanitized = [];
            for (var i = 0; i < this.ageGroups.length; i++) {
                var ageGroup = this.ageGroups[i];
                var existing = _.find(event.disciplines, function (d) { return d.ageGroup === ageGroup; });
                if (existing) {
                    sanitized[i] = existing;
                }
                else {
                    sanitized[i] = { ageGroup: this.ageGroups[i], disciplines: [] };
                }
            }
            // override event disciplines with the sanitized list
            event.disciplines = sanitized;
        };
        EventEditController.prototype.saveNow = function (event) {
            var _this = this;
            this.EventsService.update(event).then(function () {
                _this.showSave = false;
                toastr.info('Dine ændringer er gemt');
            });
        };
        EventEditController.prototype.participantEmailListClickHandler = function (event) {
            var _this = this;
            var controller = event.data;
            controller.$scope.$apply(function () {
                if (!controller.$element.find('#showParticipantEmailListElement')[0].contains(event.target)) {
                    controller.showParticipantEmailList = false;
                    controller.$document.off('click', _this.participantEmailListClickHandler);
                }
            });
        };
        EventEditController.prototype.toggleParticipantEmailList = function () {
            var _this = this;
            this.showParticipantEmailList = !this.showParticipantEmailList;
            if (this.showParticipantEmailList) {
                var list = _.join(_.map(_.uniqBy(this.registrations, function (r) { return r.email; }), function (r) { return r.email; }), ';');
                this.participanEmailList = list;
                this.$timeout(function () {
                    _this.$document.on('click', _this, _this.participantEmailListClickHandler);
                }, 100);
            }
            else {
                this.participanEmailList = '';
            }
        };
        EventEditController.prototype.copyParticipantEmailListToClipboard = function () {
            var elem = this.$document.find('#participanEmailListInput');
            elem.select();
            document.execCommand("Copy");
        };
        EventEditController.prototype.copyDisciplinesToClipboard = function (disciplines) {
            this.copiedDisciplines = _.clone(disciplines);
            var disciplineText = disciplines.length == 1 ? 'disciplin' : 'discipliner';
            toastr.info(disciplines.length + ' ' + disciplineText + ' kopieret til udklipsholderen');
        };
        EventEditController.prototype.pasteDisciplinesFromClipboard = function (index) {
            this.event.disciplines[index].disciplines = this.copiedDisciplines;
        };
        EventEditController.prototype.updateExcelDownloadUrl = function () {
            this.excelDownloadUrl = globals.apiUrl + '/events/' + this.event.id + '/registrations.xlsx';
        };
        EventEditController.$inject = [
            '$scope',
            '$state',
            '$window',
            '$document',
            '$sce',
            '$timeout',
            '$element',
            'moment',
            'EventsService',
            'AuthService',
            'hotkeys'
        ];
        return EventEditController;
    }());
    events.EventEditController = EventEditController;
})(events || (events = {}));
angular.module('events')
    .controller('EventEditController', events.EventEditController);
/// <reference path="../../typings/tsd.d.ts"/>
var events;
(function (events) {
    'use strict';
    var EventRegisterController = (function () {
        function EventRegisterController($scope, $state, $window, $sce, $timeout, moment, EventsService, MembersService) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$window = $window;
            this.$sce = $sce;
            this.$timeout = $timeout;
            this.moment = moment;
            this.EventsService = EventsService;
            this.MembersService = MembersService;
            this.registrationIsValid = false;
            this.alerts = [];
            this.registering = false;
            this.registrationComplete = false;
            this.canSelectMoreDisciplines = true;
            this.eventHasDisciplines = false;
            if (!$state.params.id) {
                $state.go('home');
                return;
            }
            this.EventsService.get($state.params.id).then(function (event) {
                _this.event = event;
                if (event.address) {
                    _this.trustedMapUrl =
                        _this.$sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyC-0IZYk7mmRswHapPmWnSpMa6i2kHnP9I&q=' + event.address);
                }
                _this.eventHasDisciplines = _this.event.disciplines.filter(function (d) { return d.disciplines.length > 0; }).length > 0;
                _this.updateExtraDisciplineAgeGroups();
            });
            this.birthYears = this.MembersService.getAllowedBirthYears();
            // Show email receipt message until - not including - the given expire date
            var expireDate = new Date('2018-04-01');
            var now = new Date();
            if (now <= expireDate) {
                setTimeout(function () {
                    toastr.info('Når du har gennemført din tilmelding modtager du en bekræftelses-e-mail. Modtager du - mod forventning - ikke denne e-mail bør du kontakte os.<br /><br /><button type="button" class="btn clear o-button--default">OK, det er forstået</button>', 'Vi har tilføjet e-mail-bekræftelse ved tilmelding', { timeOut: 0, extendedTimeOut: 0, positionClass: "toast-top-center registration-toast" });
                }, 2000);
            }
            ;
        }
        EventRegisterController.prototype.updateDisciplines = function () {
            // Reset already selected disciplines
            _.each(this.registrationData.disciplines, function (discipline) {
                discipline.selected = false;
            });
            // Reset registration data
            this.registrationData.disciplines = [];
            this.registrationData.ageGroup = null;
            if (this.registrationData.birthYear) {
                var eventYear = this.event.date.getFullYear();
                var diff = eventYear - this.registrationData.birthYear;
                // run through age groups looking for disciplines
                var foundAgeGroupWithDisciplines = false;
                for (var i = diff; i <= 19; i++) {
                    var ageGroupDisciplines = this.getAgeGroupDisciplines(i.toString());
                    if (ageGroupDisciplines && ageGroupDisciplines.length > 0) {
                        this.registrationData.disciplines = ageGroupDisciplines;
                        this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, i.toString());
                        foundAgeGroupWithDisciplines = true;
                        break;
                    }
                }
                // If none were found in regular age search look for grown up disciplines        
                if (!foundAgeGroupWithDisciplines) {
                    if (this.registrationData.gender === 'female') {
                        var ageGroupDisciplines = this.getAgeGroupDisciplines('K');
                        if (ageGroupDisciplines && ageGroupDisciplines.length > 0) {
                            this.registrationData.disciplines = ageGroupDisciplines;
                            this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, 'K');
                        }
                    }
                    if (this.registrationData.gender === 'male') {
                        var ageGroupDisciplines = this.getAgeGroupDisciplines('M');
                        if (ageGroupDisciplines && ageGroupDisciplines.length > 0) {
                            this.registrationData.disciplines = ageGroupDisciplines;
                            this.registrationData.ageGroup = this.getAgeClass(this.registrationData.gender, 'M');
                        }
                    }
                }
            }
        };
        // Given a gender (male of female) and a ageString (7, 8, 9, ....,  19, K, M)
        // Returns the age classification like D7, P7, D8, ...
        EventRegisterController.prototype.getAgeClass = function (gender, ageString) {
            if (!gender) {
                return null;
            }
            if (!ageString) {
                return null;
            }
            switch (ageString) {
                case 'K': return 'K';
                case 'M': return 'M';
                default: return gender === 'male' ? 'D' + ageString : 'P' + ageString;
            }
        };
        // sets age groups to age groups where there are disciplines    
        EventRegisterController.prototype.updateExtraDisciplineAgeGroups = function () {
            this.ageGroups = _.map(_.filter(this.event.disciplines, function (discipline) { return discipline.disciplines.length > 0; }), function (discipline) {
                return discipline.ageGroup;
            });
        };
        // Age group will be something like "7", "8" etc.    
        EventRegisterController.prototype.getAgeGroupDisciplines = function (ageGroup) {
            var ageGroupDiscipline = _.find(this.event.disciplines, function (discipline) { return discipline.ageGroup === ageGroup; });
            if (!ageGroupDiscipline) {
                return null;
            }
            return ageGroupDiscipline.disciplines;
        };
        EventRegisterController.prototype.addExtraDiscipline = function () {
            if (!this.registrationData.extraDisciplines) {
                this.registrationData.extraDisciplines = [];
            }
            this.registrationData.extraDisciplines.push({});
            this.updateCanSelectMoreDisciplines();
        };
        EventRegisterController.prototype.removeExtraDiscipline = function (index) {
            this.registrationData.extraDisciplines.splice(index, 1);
            this.updateCanSelectMoreDisciplines();
            this.validate(this.registrationData);
        };
        EventRegisterController.prototype.onDataChange = function (registrationData) {
            this.validate(registrationData);
        };
        EventRegisterController.prototype.toggleDiscipline = function (discipline) {
            discipline.selected = !discipline.selected;
            this.updateCanSelectMoreDisciplines();
        };
        EventRegisterController.prototype.updateCanSelectMoreDisciplines = function () {
            var selectedDisciplinesCount = _.filter(this.registrationData.disciplines, { selected: true }).length;
            var extraDisciplinesCount = this.registrationData.extraDisciplines ? this.registrationData.extraDisciplines.length : 0;
            this.canSelectMoreDisciplines = selectedDisciplinesCount + extraDisciplinesCount < this.event.maxDisciplinesAllowed;
        };
        EventRegisterController.prototype.validate = function (registrationData) {
            this.registrationIsValid = true;
            this.validationErrors = [];
            if (!registrationData.name || registrationData.name.trim() === '') {
                this.registrationIsValid = false;
                this.validationErrors.push('Angive deltagerens navn');
            }
            if (!registrationData.gender || registrationData.gender.trim() === '') {
                this.registrationIsValid = false;
                this.validationErrors.push('Angive om deltageren er en pige eller en dreng');
            }
            if (!registrationData.birthYear) {
                this.registrationIsValid = false;
                this.validationErrors.push('Angive deltagerens alder');
            }
            if (!registrationData.email || registrationData.email.trim() === '') {
                this.registrationIsValid = false;
                this.validationErrors.push('Angive din e-mail adresse');
            }
            // ensure at least on displine selected if the event itself has any disciplines
            if (this.eventHasDisciplines) {
                var hasSelectedDiscipline = registrationData.disciplines && registrationData.disciplines.filter(function (d) { return d.selected; }).length > 0;
                var hasSelectedExtraDiscipline = registrationData.extraDisciplines && registrationData.extraDisciplines.length > 0;
                if (!hasSelectedDiscipline && !hasSelectedExtraDiscipline) {
                    this.registrationIsValid = false;
                    this.validationErrors.push('Angive hvilke discipliner der stilles op i');
                }
            }
            if (!registrationData.recaptcha) {
                this.registrationIsValid = false;
                this.validationErrors.push('Angive at du ikke er en robot');
            }
        };
        EventRegisterController.prototype.validateDelayed = function () {
            var _this = this;
            this.$timeout(function () {
                _this.validate(_this.registrationData);
            }, 200);
        };
        EventRegisterController.prototype.register = function (registrationData) {
            var _this = this;
            this.alerts = [];
            this.registering = true;
            this.registration = this.buildRegistration(registrationData);
            this.EventsService.register(this.registration).then(function (data) {
                _this.registrationComplete = true;
            }).catch(function (err) {
                _this.alerts.push({ type: 'danger', msg: 'Hov, noget gik galt under din registrering. Prøv lige en gang til eller kontakt GIK.' });
            }).finally(function () {
                _this.registering = false;
            });
        };
        EventRegisterController.prototype.buildRegistration = function (registrationData) {
            var _this = this;
            var registration = {
                id: null,
                eventId: this.event.id,
                name: registrationData.name,
                email: registrationData.email,
                birthYear: registrationData.birthYear,
                ageClass: registrationData.ageGroup,
                recaptcha: registrationData.recaptcha,
                disciplines: [],
                extraDisciplines: []
            };
            _.each(registrationData.disciplines, function (discipline) {
                if (discipline.selected) {
                    registration.disciplines.push({
                        id: discipline.id,
                        name: discipline.name,
                        personalRecord: discipline.personalRecord
                    });
                }
            });
            _.each(registrationData.extraDisciplines, function (discipline) {
                registration.extraDisciplines.push({
                    ageClass: _this.getAgeClass(registrationData.gender, discipline.ageGroup),
                    id: _this.EventsService.findDisciplineIdByName(discipline.name),
                    name: discipline.name,
                    personalRecord: discipline.personalRecord
                });
            });
            return registration;
        };
        EventRegisterController.$inject = [
            '$scope',
            '$state',
            '$window',
            '$sce',
            '$timeout',
            'moment',
            'EventsService',
            'MembersService'
        ];
        return EventRegisterController;
    }());
    events.EventRegisterController = EventRegisterController;
})(events || (events = {}));
angular.module('events')
    .controller('EventRegisterController', events.EventRegisterController);
/// <reference path="../../typings/tsd.d.ts"/>
var events;
(function (events_1) {
    'use strict';
    var EventsController = (function () {
        function EventsController($scope, $rootScope, $state, $window, EventsService, AuthService, DateService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$window = $window;
            this.EventsService = EventsService;
            this.AuthService = AuthService;
            this.DateService = DateService;
            this.updateEventLists();
            this.listenForChildEvents();
        }
        EventsController.prototype.updateEventLists = function () {
            var _this = this;
            if (this.$scope.isAuthenticated) {
                this.EventsService.getAll()
                    .then(function (events) {
                    _this.handleServerEventsReceived(events);
                })
                    .catch(function (err) {
                    throw err;
                });
            }
            else {
                this.EventsService.getPublicEvents()
                    .then(function (events) {
                    _this.handleServerEventsReceived(events);
                })
                    .catch(function (err) {
                    throw err;
                });
            }
        };
        EventsController.prototype.handleServerEventsReceived = function (events) {
            var _this = this;
            // get registrations for all events - one by one
            _.each(events, function (event) {
                event.registrationsStatus = 'pending';
                _this.getRegistrations(event);
            });
            // resolve current and old events
            var activeEvents = _.filter(events, function (e) { return !e.isOldEvent; });
            var oldEvents = _.filter(events, function (e) { return e.isOldEvent; });
            // populate lists      
            this.events = _.orderBy(activeEvents, ['date'], ['asc']);
            this.oldEvents = _.orderBy(oldEvents, ['date'], ['desc']);
        };
        EventsController.prototype.addEvent = function () {
            var _this = this;
            this.EventsService.add(new events_1.Event({}, this.DateService)).then(function (event) {
                _this.$state.go('events_edit', { id: event.id });
            });
        };
        EventsController.prototype.listenForChildEvents = function () {
            var _this = this;
            this.$scope.$on('event-added', function ($event) {
                _this.updateEventLists();
            });
            this.$scope.$on('event-updated', function ($event) {
                _this.updateEventLists();
            });
            this.$scope.$on('event-deleted', function ($event, event) {
                _.remove(_this.events, { id: event.id });
            });
        };
        EventsController.prototype.logout = function () {
            this.AuthService.logout();
            this.$state.go('login');
        };
        EventsController.prototype.getRegistrations = function (event) {
            this.EventsService.getRegistrations(event.id).then(function (registrations) {
                _.each(registrations, function (registration) {
                    registration.disciplines = registration.disciplines.concat(registration.extraDisciplines);
                });
                event.registrations = registrations;
                event.registrationsStatus = 'fetched';
            });
        };
        EventsController.$inject = [
            '$scope',
            '$rootScope',
            '$state',
            '$window',
            'EventsService',
            'AuthService',
            'DateService'
        ];
        return EventsController;
    }());
    events_1.EventsController = EventsController;
})(events || (events = {}));
angular.module('events')
    .controller('EventsController', events.EventsController);
/// <reference path="../../typings/tsd.d.ts"/>
var events;
(function (events_2) {
    'use strict';
    var EventsService = (function () {
        function EventsService($http, $q, DateService) {
            this.$http = $http;
            this.$q = $q;
            this.DateService = DateService;
            this.API_PATH = globals.apiUrl;
        }
        EventsService.prototype.getAll = function () {
            var _this = this;
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
            this.$http.get(this.API_PATH + '/events').then(function (response) {
                // put in cache
                _this.events = _.map(response.data, function (eventData) {
                    return new events_2.Event(eventData, _this.DateService);
                });
                // ... and return
                deferred.resolve(_this.events);
            }).catch(function (err) {
                deferred.reject(err);
            });
            this.getAllPromise = deferred.promise;
            return this.getAllPromise;
        };
        EventsService.prototype.getPublicEvents = function () {
            var deferred = this.$q.defer();
            this.getAll().then(function (events) {
                var now = new Date();
                var today = new Date();
                today.setUTCHours(0, 0, 0, 0);
                // events are public when the event end date has not yet passed
                var publicEvents = _.filter(events, function (event) {
                    var eventEndDateOffset = new Date(event.date.getTime());
                    eventEndDateOffset.setDate(eventEndDateOffset.getDate() + 1);
                    var isActive = today < eventEndDateOffset;
                    return isActive;
                });
                deferred.resolve(publicEvents);
            }).catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        EventsService.prototype.add = function (event) {
            var _this = this;
            var deferred = this.$q.defer();
            // give it a temporary id
            event.id = '-1';
            // ... and post to server
            this.$http.post(this.API_PATH + '/events', event)
                .then(function (response) {
                var newEvent = new events_2.Event(response.data, _this.DateService);
                _this.events.push(newEvent);
                deferred.resolve(newEvent);
            }).catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        EventsService.prototype.get = function (id) {
            var deferred = this.$q.defer();
            this.getAll().then(function (events) {
                var event = _.find(events, { id: id });
                deferred.resolve(event);
            }).catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        EventsService.prototype.update = function (event) {
            var deferred = this.$q.defer();
            this.$http.post(this.API_PATH + '/events/' + event.id, event).then(function (response) {
                deferred.resolve();
            }).catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        EventsService.prototype.delete = function (event) {
            var _this = this;
            var deferred = this.$q.defer();
            // remove from cached list
            _.remove(this.events, function (e) { return e.id === event.id; });
            // ... and delete from server
            this.$http.delete(this.API_PATH + '/events/' + event.id).then(function (response) {
                deferred.resolve();
            }).catch(function (err) {
                // re-add to list if error occured
                _this.events.push(event);
                // ... and reject
                deferred.reject(err);
            });
            return deferred.promise;
        };
        EventsService.prototype.register = function (registration) {
            return this.$http.post(this.API_PATH + '/events/' + registration.eventId + '/registrations', registration);
        };
        EventsService.prototype.getRegistrations = function (id) {
            var deferred = this.$q.defer();
            this.$http.get(this.API_PATH + "/events/" + id + "/registrations").then(function (response) {
                var registrations = _.map(response.data, function (registrationData) { return new events_2.Registration(registrationData); });
                deferred.resolve(registrations);
            }).catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        EventsService.prototype.getAllDisciplines = function () {
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
        };
        EventsService.prototype.findDisciplineIdByName = function (name) {
            var discipline = _.find(this.getAllDisciplines(), { name: name });
            if (discipline) {
                return discipline.id;
            }
            return null;
        };
        EventsService.prototype.getAgeClasses = function () {
            var classes = [];
            for (var i = 2; i <= 19; i++) {
                classes.push('P' + i);
            }
            classes.push('K');
            for (var i = 2; i <= 19; i++) {
                classes.push('D' + i);
            }
            classes.push('M');
            return classes;
        };
        EventsService.prototype.getAgeGroups = function () {
            var ageGroups = [];
            for (var i = 2; i <= 19; i++) {
                ageGroups.push(i.toString());
            }
            ageGroups.push('K');
            ageGroups.push('M');
            return ageGroups;
        };
        EventsService.$inject = ['$http', '$q', 'DateService'];
        return EventsService;
    }());
    events_2.EventsService = EventsService;
})(events || (events = {}));
angular.module('events')
    .service('EventsService', events.EventsService);
var events;
(function (events) {
    var Registration = (function () {
        function Registration(registrationData) {
            this.id = registrationData._id || registrationData.id;
            this.eventId = registrationData.eventId;
            this.name = registrationData.name;
            this.email = registrationData.email;
            this.birthYear = registrationData.birthYear;
            this.ageClass = registrationData.ageClass;
            this.disciplines = registrationData.disciplines || [];
            this.extraDisciplines = registrationData.extraDisciplines || [];
        }
        return Registration;
    }());
    events.Registration = Registration;
})(events || (events = {}));
var events;
(function (events) {
    'use strict';
    function eventAddressComponent() {
        return {
            templateUrl: 'events/address.component/event.address.component.html',
            controller: events.EventAddressComponentController,
            bindings: {
                address: '<',
                editable: '<',
                onChange: '&'
            }
        };
    }
    events.eventAddressComponent = eventAddressComponent;
    var EventAddressComponentController = (function () {
        function EventAddressComponentController($scope, $sce) {
            var _this = this;
            this.$scope = $scope;
            this.$sce = $sce;
            if (this.editable === undefined) {
                this.editable = false;
            }
            this.$scope.$watch('$ctrl.address', function () { _this.onAddressChanged(); });
        }
        EventAddressComponentController.prototype.onAddressChanged = function () {
            if (this.address) {
                var strippedAddress = this.address.replace(/<[^>]+>/gm, '');
                this.trustedMapUrl = this.$sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyC-0IZYk7mmRswHapPmWnSpMa6i2kHnP9I&q=' + strippedAddress);
            }
            else {
                this.trustedMapUrl = false;
            }
        };
        EventAddressComponentController.$inject = [
            '$scope',
            '$sce'
        ];
        return EventAddressComponentController;
    }());
    events.EventAddressComponentController = EventAddressComponentController;
})(events || (events = {}));
angular.module('events')
    .component('eventAddress', events.eventAddressComponent());
var events;
(function (events) {
    'use strict';
    function eventListItemComponent() {
        return {
            templateUrl: 'events/event-list-item.component/event-list-item.component.html',
            controller: events.EventListItemController,
            bindings: {
                event: '<'
            }
        };
    }
    events.eventListItemComponent = eventListItemComponent;
    var EventListItemController = (function () {
        function EventListItemController($scope, $window, EventsService, moment, authService) {
            this.$scope = $scope;
            this.$window = $window;
            this.EventsService = EventsService;
            this.moment = moment;
            this.authService = authService;
            this.isAuthenticated = this.authService.isAuthenticated;
        }
        EventListItemController.prototype.getDateFromNow = function (date) {
            if (!date) {
                return '';
            }
            var today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            if (this.moment(date).isSame(new Date(), 'day')) {
                return 'i dag';
            }
            return this.moment(date).from(today);
        };
        EventListItemController.prototype.isImminent = function (date) {
            if (!date) {
                return false;
            }
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            var diff = (date.getTime() - now.getTime());
            var millisecondsOnADay = 1000 * 60 * 60 * 24;
            return diff < millisecondsOnADay * 5;
        };
        EventListItemController.prototype.getDisciplineClass = function (discipline, registration) {
            if (discipline.ageClass) {
                return discipline.ageClass;
            }
            return registration.ageClass;
        };
        EventListItemController.prototype.handleEventDeleteClicked = function (event) {
            var _this = this;
            if (this.$window.confirm("Er du sikker p\u00E5 at du vil slette " + event.title + "?")) {
                this.EventsService.delete(event).then(function () {
                    _this.$scope.$emit('event-deleted', event);
                    toastr.success('Stævnet er slettet');
                });
            }
        };
        EventListItemController.$inject = [
            '$scope',
            '$window',
            'EventsService',
            'moment',
            'AuthService'
        ];
        return EventListItemController;
    }());
    events.EventListItemController = EventListItemController;
})(events || (events = {}));
angular.module('events')
    .component('eventListItem', events.eventListItemComponent());
/// <reference path="../../typings/tsd.d.ts"/>
var featuretoggles;
(function (featuretoggles) {
    'use strict';
    var FeatureTogglesService = (function () {
        function FeatureTogglesService() {
        }
        FeatureTogglesService.prototype.isMembersEnabled = function () { return true; };
        FeatureTogglesService.$inject = [];
        return FeatureTogglesService;
    }());
    featuretoggles.FeatureTogglesService = FeatureTogglesService;
})(featuretoggles || (featuretoggles = {}));
angular.module('featuretoggles')
    .service('FeatureTogglesService', featuretoggles.FeatureTogglesService);
var members;
(function (members) {
    var GetMemberResponse = (function () {
        function GetMemberResponse(data) {
            this.member = new members.Member(data.member);
            this.messages = data.messages.map(function (m) { return new members.MemberMessage(m); });
        }
        return GetMemberResponse;
    }());
    members.GetMemberResponse = GetMemberResponse;
})(members || (members = {}));
var members;
(function (members) {
    var MemberMessage = (function () {
        function MemberMessage(data) {
            this.id = data.id;
            this.memberId = data.memberId;
            this.to = data.to;
            this.subject = data.subject;
            this.htmlContent = data.htmlContent;
            this.sent = data.sent;
        }
        return MemberMessage;
    }());
    members.MemberMessage = MemberMessage;
})(members || (members = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var members;
(function (members) {
    'use strict';
    var MemberAddController = (function () {
        function MemberAddController($scope, $state, $window, $q, moment, $uibModal, MembersService, AuthService) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$window = $window;
            this.$q = $q;
            this.moment = moment;
            this.$uibModal = $uibModal;
            this.MembersService = MembersService;
            this.AuthService = AuthService;
            this.member = new members.Member({});
            this.sendWelcomeMessageOnCreation = true;
            this.welcomeMessageSubject = 'Velkommen til Gentofte Atletik';
            this.birthYears = this.MembersService.getAllowedBirthYears();
            this.selectableTeams = this.MembersService.getTeamInfos();
            this.selectableGenders = this.MembersService.getGenderInfos();
            this.member.startDate = moment(new Date()).format('YYYY-MM-DD');
            this.welcomeMessageTemplate = this.getWelcomeMessageTemplate(null);
            this.$scope.$on('family-membership-number-found', function ($event, number) {
                _this.member.familyMembershipNumber = number;
            });
        }
        MemberAddController.prototype.addMember = function (member) {
            var _this = this;
            if (!member.name) {
                this.errorMessage = 'Du kan ikke oprette et medlem uden navn';
                return;
            }
            if (!member.email) {
                this.errorMessage = 'Du kan ikke oprette et medlem uden email-adresse';
                return;
            }
            if (!this.form.inputBirthDate.$valid) {
                this.errorMessage = 'Fødselsdatoen skal være i formatet: åååå-mm-dd';
                return;
            }
            member.team = this.selectedTeam ? parseInt(this.selectedTeam) : null;
            member.gender = this.selectedGender ? parseInt(this.selectedGender) : null;
            var request = {
                member: member,
                welcomeMessage: {
                    send: this.sendWelcomeMessageOnCreation,
                    subject: this.welcomeMessageSubject,
                    template: this.welcomeMessageTemplate
                }
            };
            this.MembersService.add(request).then(function (response) {
                toastr.info('Medlemmet er oprettet med medlemsnummer ' + response.member.number);
                setTimeout(function () { return _this.$state.go('members'); }, 1000);
            });
        };
        MemberAddController.prototype.handleSelectedTeamChanged = function (team) {
            var _this = this;
            if (this.welcomeMessageChangedByUser) {
                this.$uibModal
                    .open({
                    templateUrl: 'members/modals/member.add.template-changed.modal.controller.html',
                    controller: 'MemberAddTemplateChangedModalController',
                    controllerAs: 'vm',
                    resolve: {
                        context: function () {
                            return {};
                        }
                    }
                })
                    .result.then(function (changeTemplate) {
                    if (changeTemplate) {
                        _this.welcomeMessageTemplate = _this.getWelcomeMessageTemplate(team);
                    }
                })
                    .catch(function (err) {
                    toastr.error(err.statusText, err.status);
                });
                return;
            }
            else {
                this.welcomeMessageTemplate = this.getWelcomeMessageTemplate(team);
            }
        };
        MemberAddController.prototype.getWelcomeMessageTemplate = function (team) {
            switch (team) {
                case '1':
                    return ('**Kære {{member_name}}**\n\n' +
                        'Velkommen til Gentofte Atletik.\n\n' +
                        'Du skal betale kontingent senest den {{latest_payment_date}}.\n\n' +
                        'Med venlig hilsen\n' +
                        'Gentofte Atletik');
                default:
                    return ('**Default Kære {{member_name}}**\n\n' +
                        'Velkommen til Gentofte Atletik.\n\n' +
                        'Du skal betale kontingent senest den {{latest_payment_date}}.\n\n' +
                        'Med venlig hilsen\n' +
                        'Gentofte Atletik');
            }
        };
        MemberAddController.$inject = ['$scope', '$state', '$window', '$q', 'moment', '$uibModal', 'MembersService', 'AuthService'];
        return MemberAddController;
    }());
    members.MemberAddController = MemberAddController;
})(members || (members = {}));
angular.module('members').controller('MemberAddController', members.MemberAddController);
var members;
(function (members) {
    var Member = (function () {
        function Member(memberData) {
            this.id = memberData._id || memberData.id;
            this.number = memberData.number;
            this.name = memberData.name;
            this.email = memberData.email;
            this.email2 = memberData.email2;
            this.familyMembershipNumber = memberData.familyMembershipNumber;
            this.birthDate = memberData.birthDate;
            // Get date part only from birth date
            if (this.birthDate && this.birthDate.length > 10) {
                this.birthDate = this.birthDate.substring(0, 10);
            }
            this.hasOutstandingMembershipPayment = memberData.hasOutstandingMembershipPayment;
            this.terminationDate = memberData.terminationDate;
            // Get date part only from start date
            if (this.terminationDate && this.terminationDate.length > 10) {
                this.terminationDate = this.terminationDate.substring(0, 10);
            }
            this.startDate = memberData.startDate;
            // Get date part only from start date
            if (this.startDate && this.startDate.length > 10) {
                this.startDate = this.startDate.substring(0, 10);
            }
            this.team = memberData.team;
            this.gender = memberData.gender;
        }
        return Member;
    }());
    members.Member = Member;
})(members || (members = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var members;
(function (members) {
    'use strict';
    var MemberEditController = (function () {
        function MemberEditController($scope, $state, $window, moment, $uibModal, MembersService, AuthService) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$window = $window;
            this.moment = moment;
            this.$uibModal = $uibModal;
            this.MembersService = MembersService;
            this.AuthService = AuthService;
            this.member = new members.Member({});
            if (!$state.params.id) {
                $state.go('home');
                return;
            }
            if (!AuthService.isAuthenticated) {
                $state.go('home');
                return;
            }
            this.selectableTeams = this.MembersService.getTeamInfos();
            this.selectableGenders = this.MembersService.getGenderInfos();
            this.MembersService.get($state.params.id).then(function (response) {
                console.log('response', response);
                _this.member = response.member;
                _this.selectedTeam = response.member.team !== null ? response.member.team.toString() : null;
                _this.selectedGender = response.member.gender !== null ? response.member.gender.toString() : null;
                _this.messages = response.messages;
            });
            this.$scope.$on('family-membership-number-found', function ($event, number) {
                _this.member.familyMembershipNumber = number;
            });
        }
        MemberEditController.prototype.updateMember = function (member) {
            var _this = this;
            if (!member.name) {
                this.errorMessage = 'Du kan ikke oprette et medlem uden navn';
                return;
            }
            if (!member.email) {
                this.errorMessage = 'Du kan ikke oprette et medlem uden email-adresse';
                return;
            }
            if (!this.form.inputBirthDate.$valid) {
                this.errorMessage = 'Fødselsdatoen skal være i formatet: åååå-mm-dd';
                return;
            }
            if (!this.form.inputStartDate.$valid) {
                this.errorMessage = 'Indmeldelsesdatoen skal være i formatet: åååå-mm-dd';
                return;
            }
            member.team = this.selectedTeam ? parseInt(this.selectedTeam) : null;
            member.gender = this.selectedGender ? parseInt(this.selectedGender) : null;
            this.MembersService.update(member)
                .then(function (member) {
                toastr.success('Dine ændringer er gemt');
                setTimeout(function () { return _this.$state.go('members'); }, 1000);
            })
                .catch(function (err) {
                toastr.error(err.statusText, err.status);
            });
        };
        MemberEditController.prototype.terminateMembership = function (member, $event) {
            var _this = this;
            this.$uibModal
                .open({
                templateUrl: 'members/modals/member.terminate.modal.controller.html',
                controller: 'MemberTerminateModalController',
                controllerAs: 'vm',
                resolve: {
                    context: function () {
                        return {
                            memberId: member.id
                        };
                    }
                }
            })
                .result.then(function (terminationDate) {
                toastr.success('Medlemmet er udmeldt pr. ' + terminationDate);
                _this.$state.go('members');
            })
                .catch(function (err) {
                toastr.error(err.statusText, err.status);
            });
        };
        MemberEditController.prototype.showLocalTime = function (date) {
            return this.moment(date)
                .locale('da')
                .format('LLL');
        };
        MemberEditController.$inject = ['$scope', '$state', '$window', 'moment', '$uibModal', 'MembersService', 'AuthService'];
        return MemberEditController;
    }());
    members.MemberEditController = MemberEditController;
})(members || (members = {}));
angular.module('members').controller('MemberEditController', members.MemberEditController);
/// <reference path="../../typings/tsd.d.ts"/>
var members;
(function (members) {
    'use strict';
    var MemberStatisticsController = (function () {
        function MemberStatisticsController(moment, MembersService) {
            this.moment = moment;
            this.MembersService = MembersService;
            this.year = this.moment()
                .subtract('years', 1)
                .format('YYYY');
            this.update();
        }
        MemberStatisticsController.prototype.update = function () {
            var _this = this;
            this.MembersService.getCfrStatistics(this.year).then(function (statistics) {
                console.log(statistics);
                _this.statistics = statistics;
                _this.totals = {
                    females: _.sumBy(statistics, function (i) { return i.females; }),
                    males: _.sumBy(statistics, function (i) { return i.males; }),
                    total: _.sumBy(statistics, function (i) { return i.females + i.males; })
                };
                _this.labels = _.map(_this.statistics, function (s) { return s.age + ' år'; });
                _this.series = ['Piger', 'Drenge'];
                _this.data = [_.map(_this.statistics, function (s) { return s.females; }), _.map(_this.statistics, function (s) { return s.males; })];
            });
        };
        MemberStatisticsController.$inject = ['moment', 'MembersService'];
        return MemberStatisticsController;
    }());
    members.MemberStatisticsController = MemberStatisticsController;
})(members || (members = {}));
angular.module('members').controller('MemberStatisticsController', members.MemberStatisticsController);
/// <reference path="../../typings/tsd.d.ts"/>
var members;
(function (members_1) {
    'use strict';
    var MembersController = (function () {
        function MembersController($scope, $state, $window, $filter, moment, membersService, authService) {
            this.$scope = $scope;
            this.$state = $state;
            this.$window = $window;
            this.$filter = $filter;
            this.moment = moment;
            this.membersService = membersService;
            this.authService = authService;
            this.updateMemberList();
            this.listenForChildEvents();
            this.filters = {};
        }
        MembersController.prototype.updateMemberList = function () {
            var _this = this;
            this.membersService.getAll()
                .then(function (members) {
                // order members by name
                _this.allMembers = _.orderBy(members, ['name']);
                // make team and gender enums searchable
                _.forEach(_this.allMembers, function (m) {
                    m.teamLabel = _this.membersService.getTeamLabel(m.team);
                    m.genderLabel = _this.membersService.getGenderLabel(m.gender);
                });
                // filter members by search text and other filters
                _this.filterMembers();
            })
                .catch(function (err) {
                toastr.error(err.statusText, err.status);
                throw err;
            });
        };
        MembersController.prototype.addMember = function () {
            alert('Not implmented yet');
        };
        MembersController.prototype.listenForChildEvents = function () {
            var _this = this;
            this.$scope.$on('member-updated', function (member) {
                _this.updateMemberList();
            });
            this.$scope.$on('member-deleted', function () {
                _this.updateMemberList();
            });
        };
        MembersController.prototype.filterMembers = function () {
            var _this = this;
            this.members = this.allMembers.filter(function (m) {
                var includeMember = true;
                // filter by gender
                switch (_this.filters.genderFilter) {
                    case 'female':
                        includeMember = includeMember && m.gender === 1;
                        break;
                    case 'male':
                        includeMember = includeMember && m.gender === 2;
                        break;
                    case 'null':
                        includeMember = includeMember && !m.gender;
                        break;
                }
                // filter by team
                switch (_this.filters.team) {
                    case '1':
                        includeMember = includeMember && m.team === 1;
                        break;
                    case '2':
                        includeMember = includeMember && m.team === 2;
                        break;
                    case '3':
                        includeMember = includeMember && m.team === 3;
                        break;
                    case 'null':
                        includeMember = includeMember && !m.team;
                        break;
                }
                // filter by birth date existing
                if (_this.filters.birthDateNull) {
                    includeMember = includeMember && !m.birthDate;
                }
                // filter by start date existing
                if (_this.filters.startDateNull) {
                    includeMember = includeMember && !m.startDate;
                }
                // filter by membership payment
                switch (_this.filters.memberhipPayment) {
                    case '1':
                        includeMember = includeMember && m.hasOutstandingMembershipPayment === true;
                        break;
                    case '2':
                        includeMember = includeMember && m.hasOutstandingMembershipPayment === false;
                        break;
                }
                return includeMember;
            });
            // filter by search
            this.members = this.$filter('filter')(this.members, this.search);
            // filter by typed birth date
            if (!this.filters.birthDateNull && this.filters.birthDate) {
                this.members = this.$filter('filter')(this.members, { birthDate: this.filters.birthDate });
            }
            // filter by typed start date
            if (!this.filters.startDateNull && this.filters.startDate) {
                this.members = this.$filter('filter')(this.members, { startDate: this.filters.startDate });
            }
        };
        MembersController.prototype.chargeMemberships = function () {
            var _this = this;
            if (confirm('Er du sikker på at du vil opkræve alle medlemmer?')) {
                toastr.info('Opkræver alle medlemmer. Vent venligst...');
                this.membersService.chargeMemberships().then(function () {
                    toastr.success('Alle medlemmer er nu registreret som havende udestående kontingent', 'Opkrævning gennemført');
                    _this.updateMemberList();
                }).catch(function (err) {
                    toastr.error(err.statusText, err.status);
                });
            }
        };
        MembersController.prototype.searchChanged = function () {
            this.updateMemberList();
        };
        MembersController.prototype.getCsvMembers = function () {
            return _.map(this.members, function (m) {
                return {
                    id: m.id,
                    number: m.number,
                    name: m.name,
                    genderLabel: m.genderLabel,
                    teamLabel: m.teamLabel,
                    email: m.email,
                    email2: m.email2,
                    familyMembershipNumber: m.familyMembershipNumber,
                    birthDate: m.birthDate,
                    hasOutstandingMembershipPayment: m.hasOutstandingMembershipPayment,
                    startDate: m.startDate,
                    terminationDate: m.terminationDate
                };
            });
        };
        MembersController.prototype.getCsvHeaders = function () {
            return ['Id', 'Nummer', 'Navn', 'Køn', 'Hold', 'Email', 'Email 2', 'Fam. medl. nummer', 'Fødselsdato', 'Udest. kontingent',
                'Indmeldelsesdato', 'Udmeldelsesdato'];
        };
        MembersController.prototype.copyMemberEmailList = function () {
            var emails = _.uniq(_.map(this.members, function (m) { return m.email; }));
            var emailsCount = emails.length;
            var emailsString = _.join(emails, ';');
            var copyContentInput = document.getElementById('copyContent');
            copyContentInput.value = emailsString;
            copyContentInput.select();
            document.execCommand('Copy');
            toastr.success(emailsCount + " e-mailadresse" + (emailsCount > 1 ? 'r' : '') + " kopieret til udklipsholderen");
        };
        MembersController.$inject = [
            '$scope',
            '$state',
            '$window',
            '$filter',
            'moment',
            'MembersService',
            'AuthService'
        ];
        return MembersController;
    }());
    members_1.MembersController = MembersController;
})(members || (members = {}));
angular.module('members')
    .controller('MembersController', members.MembersController);
/// <reference path="../../typings/tsd.d.ts"/>
var members;
(function (members_2) {
    'use strict';
    var MembersService = (function () {
        function MembersService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.API_PATH = globals.apiUrl;
        }
        MembersService.prototype.getAll = function () {
            var deferred = this.$q.defer();
            this.$http
                .get(this.API_PATH + '/members')
                .then(function (response) {
                var members = _.map(response.data.items, function (memberData) {
                    return new members_2.Member(memberData);
                });
                deferred.resolve(members);
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.prototype.getTerminatedMembers = function () {
            var deferred = this.$q.defer();
            this.$http
                .get(this.API_PATH + '/members/terminated')
                .then(function (response) {
                var members = _.map(response.data.items, function (memberData) {
                    return new members_2.Member(memberData);
                });
                deferred.resolve(members);
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.prototype.add = function (request) {
            var deferred = this.$q.defer();
            // give it a temporary id
            request.member.id = '-1';
            // ... and post to server
            this.$http
                .post(this.API_PATH + '/members', request)
                .then(function (response) {
                var responseData = response.data;
                deferred.resolve(responseData);
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.prototype.get = function (id) {
            var deferred = this.$q.defer();
            this.$http
                .get(this.API_PATH + '/members/' + id)
                .then(function (response) {
                var responseData = new members_2.GetMemberResponse(response.data);
                deferred.resolve(responseData);
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.prototype.update = function (member) {
            var deferred = this.$q.defer();
            this.$http
                .put(this.API_PATH + '/members/' + member.id, member)
                .then(function (response) {
                deferred.resolve();
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.prototype.getAllowedBirthYears = function () {
            var currentYear = new Date().getFullYear();
            var maximumYear = currentYear - 2 + 1;
            var minimumYear = currentYear - 19 - 1;
            var birthYears = [];
            for (var i = maximumYear; i >= minimumYear; i--) {
                birthYears.push(i);
            }
            birthYears.push(minimumYear - 1 + ' eller før');
            return birthYears;
        };
        MembersService.prototype.chargeMemberships = function () {
            var deferred = this.$q.defer();
            this.$http
                .post(this.API_PATH + '/members/charge-all', {})
                .then(function (response) {
                deferred.resolve();
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.prototype.terminateMembership = function (id, terminationDate) {
            var deferred = this.$q.defer();
            this.$http
                .post(this.API_PATH + '/members/terminate', {
                memberId: id,
                terminationDate: terminationDate
            })
                .then(function (response) {
                deferred.resolve();
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.prototype.getTeamInfos = function () {
            return [
                { id: 1, label: 'Miniholdet' },
                { id: 2, label: 'Mellemholdet' },
                { id: 3, label: 'Storeholdet' },
                { id: 4, label: 'Voksenatletik' }
            ];
        };
        MembersService.prototype.getTeamLabel = function (id) {
            if (id === null) {
                return null;
            }
            else {
                return _.find(this.getTeamInfos(), function (i) { return i.id === id; }).label;
            }
        };
        MembersService.prototype.getGenderInfos = function () {
            return [
                { id: 1, label: 'Pige' },
                { id: 2, label: 'Dreng' }
            ];
        };
        MembersService.prototype.getGenderLabel = function (id) {
            if (id === null) {
                return null;
            }
            else {
                return _.find(this.getGenderInfos(), function (i) { return i.id === id; }).label;
            }
        };
        MembersService.prototype.getStatistics = function (date) {
            var deferred = this.$q.defer();
            this.$http
                .get(this.API_PATH + '/members/statistics?date=' + date)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.prototype.getCfrStatistics = function (year) {
            var deferred = this.$q.defer();
            this.$http
                .get(this.API_PATH + '/members/statistics/cfr.json?year=' + year)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.prototype.getAvailableFamilyMembershipNumber = function () {
            var deferred = this.$q.defer();
            this.$http
                .get(this.API_PATH + '/members/available-family-membership-number')
                .then(function (response) {
                deferred.resolve(response.data.number);
            })
                .catch(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        MembersService.$inject = ['$http', '$q'];
        return MembersService;
    }());
    members_2.MembersService = MembersService;
})(members || (members = {}));
angular.module('members').service('MembersService', members.MembersService);
var members;
(function (members) {
    'use strict';
    function familyMembershipNumberFinderComponent() {
        return {
            templateUrl: 'members/family-membership-number-finder.component/family-membership-number-finder.component.html',
            controller: members.FamilyMembershipNumberFinderController,
            bindings: {
                member: '<'
            }
        };
    }
    members.familyMembershipNumberFinderComponent = familyMembershipNumberFinderComponent;
    var FamilyMembershipNumberFinderController = (function () {
        function FamilyMembershipNumberFinderController($scope, membersService) {
            this.$scope = $scope;
            this.membersService = membersService;
            this.finding = false;
        }
        FamilyMembershipNumberFinderController.prototype.findNumber = function () {
            var _this = this;
            this.finding = true;
            this.membersService.getAvailableFamilyMembershipNumber().then(function (number) {
                _this.$scope.$emit('family-membership-number-found', number);
                _this.finding = false;
            });
        };
        FamilyMembershipNumberFinderController.$inject = [
            '$scope',
            'MembersService'
        ];
        return FamilyMembershipNumberFinderController;
    }());
    members.FamilyMembershipNumberFinderController = FamilyMembershipNumberFinderController;
})(members || (members = {}));
angular.module('members')
    .component('familyMembershipNumberFinder', members.familyMembershipNumberFinderComponent());
var members;
(function (members) {
    'use strict';
    function memberListItemComponent() {
        return {
            templateUrl: 'members/member-list-item.component/member-list-item.component.html',
            controller: members.MemberListItemController,
            bindings: {
                member: '<'
            }
        };
    }
    members.memberListItemComponent = memberListItemComponent;
    var MemberListItemController = (function () {
        function MemberListItemController(membersService) {
            this.membersService = membersService;
        }
        MemberListItemController.prototype.getMemberGender = function () {
            if (this.member.gender !== null) {
                return this.membersService.getGenderLabel(this.member.gender);
            }
            else {
                return null;
            }
        };
        MemberListItemController.prototype.getMemberTeam = function () {
            if (this.member.team !== null) {
                return this.membersService.getTeamLabel(this.member.team);
            }
            else {
                return null;
            }
        };
        MemberListItemController.$inject = [
            'MembersService'
        ];
        return MemberListItemController;
    }());
    members.MemberListItemController = MemberListItemController;
})(members || (members = {}));
angular.module('members')
    .component('memberListItem', members.memberListItemComponent());
/// <reference path="../../../typings/tsd.d.ts"/>
var members;
(function (members) {
    'use strict';
    var MemberAddTemplateChangedModalController = (function () {
        function MemberAddTemplateChangedModalController($uibModalInstance, context) {
            this.$uibModalInstance = $uibModalInstance;
            this.context = context;
        }
        MemberAddTemplateChangedModalController.prototype.keep = function () {
            this.$uibModalInstance.close(false);
        };
        MemberAddTemplateChangedModalController.prototype.change = function () {
            this.$uibModalInstance.close(true);
        };
        MemberAddTemplateChangedModalController.$inject = ['$uibModalInstance', 'context'];
        return MemberAddTemplateChangedModalController;
    }());
    members.MemberAddTemplateChangedModalController = MemberAddTemplateChangedModalController;
})(members || (members = {}));
angular
    .module('members')
    .controller('MemberAddTemplateChangedModalController', members.MemberAddTemplateChangedModalController);
/// <reference path="../../../typings/tsd.d.ts"/>
var members;
(function (members) {
    'use strict';
    var MemberTerminateModalController = (function () {
        function MemberTerminateModalController($uibModalInstance, context, moment, membersService) {
            this.$uibModalInstance = $uibModalInstance;
            this.context = context;
            this.moment = moment;
            this.membersService = membersService;
            this.terminationDate = moment().format('YYYY-MM-DD');
        }
        MemberTerminateModalController.prototype.ok = function () {
            var _this = this;
            if (this.memberTerminateModalForm.inputTerminationDate.$error.required) {
                toastr.error('Du mangler at angive dato');
                return;
            }
            if (this.memberTerminateModalForm.inputTerminationDate.$error.pattern) {
                toastr.error('Datoen skal være i formatet: åååå-mm-dd');
                return;
            }
            this.membersService.terminateMembership(this.context.memberId, this.terminationDate).then(function () {
                _this.$uibModalInstance.close(_this.terminationDate);
            }).catch(function (err) {
                toastr.error(err.statusText, err.status);
            });
        };
        MemberTerminateModalController.prototype.cancel = function () {
            this.$uibModalInstance.dismiss('cancel');
        };
        MemberTerminateModalController.$inject = [
            '$uibModalInstance',
            'context',
            'moment',
            'MembersService'
        ];
        return MemberTerminateModalController;
    }());
    members.MemberTerminateModalController = MemberTerminateModalController;
})(members || (members = {}));
angular.module('members')
    .controller('MemberTerminateModalController', members.MemberTerminateModalController);
/// <reference path="../../../typings/tsd.d.ts"/>
var members;
(function (members_3) {
    'use strict';
    var TerminatedMembersController = (function () {
        function TerminatedMembersController($scope, membersService) {
            this.$scope = $scope;
            this.membersService = membersService;
            this.updateMemberList();
            this.listenForChildEvents();
        }
        TerminatedMembersController.prototype.updateMemberList = function () {
            var _this = this;
            this.membersService.getTerminatedMembers()
                .then(function (members) {
                _this.members = _.orderBy(members, ['name']);
            })
                .catch(function (err) {
                toastr.error(err.statusText, err.status);
                throw err;
            });
        };
        TerminatedMembersController.prototype.listenForChildEvents = function () {
            var _this = this;
            this.$scope.$on('member-awaken', function (event, member) {
                member.terminationDate = null;
                _this.membersService.update(member).then(function () {
                    toastr.success(member.name + ' er genindmeldt');
                    _this.updateMemberList();
                });
            });
        };
        TerminatedMembersController.$inject = [
            '$scope',
            'MembersService'
        ];
        return TerminatedMembersController;
    }());
    members_3.TerminatedMembersController = TerminatedMembersController;
})(members || (members = {}));
angular.module('members')
    .controller('TerminatedMembersController', members.TerminatedMembersController);
var members;
(function (members) {
    'use strict';
    function terminatedMemberListItemComponent() {
        return {
            templateUrl: 'members/terminated-member-list-item.component/terminated-member-list-item.component.html',
            controller: members.TerminatedMemberListItemController,
            bindings: {
                member: '<'
            }
        };
    }
    members.terminatedMemberListItemComponent = terminatedMemberListItemComponent;
    var TerminatedMemberListItemController = (function () {
        function TerminatedMemberListItemController($scope, membersService) {
            this.$scope = $scope;
            this.membersService = membersService;
        }
        TerminatedMemberListItemController.prototype.getMemberGender = function () {
            if (this.member.gender !== null) {
                return this.membersService.getGenderLabel(this.member.gender);
            }
            else {
                return null;
            }
        };
        TerminatedMemberListItemController.prototype.getMemberTeam = function () {
            if (this.member.team !== null) {
                return this.membersService.getTeamLabel(this.member.team);
            }
            else {
                return null;
            }
        };
        TerminatedMemberListItemController.prototype.awaken = function () {
            this.$scope.$emit('member-awaken', this.member);
        };
        TerminatedMemberListItemController.$inject = [
            '$scope',
            'MembersService'
        ];
        return TerminatedMemberListItemController;
    }());
    members.TerminatedMemberListItemController = TerminatedMemberListItemController;
})(members || (members = {}));
angular.module('members')
    .component('terminatedMemberListItem', members.terminatedMemberListItemComponent());
/// <reference path="../../typings/tsd.d.ts"/>
var users;
(function (users) {
    'use strict';
    var AuthService = (function () {
        function AuthService($rootScope, $http, $q) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$q = $q;
            this.API_PATH = globals.apiUrl;
            this.$rootScope.$watch('isAuthenticated', function (value) {
                _this.isAuthenticated = value;
            });
        }
        AuthService.prototype.login = function (username, password) {
            var _this = this;
            var deferred = this.$q.defer();
            this.$http.post(this.API_PATH + '/login', {
                username: username,
                password: password
            })
                .success(function (data) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('expires', data.expires.toString());
                _this.$rootScope.isAuthenticated = true;
                deferred.resolve();
            })
                .error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        // Logging out just requires removing the user's
        // id_token and profile
        AuthService.prototype.logout = function () {
            localStorage.removeItem('access_token');
            localStorage.removeItem('expires');
            this.userProfile = {};
            this.$rootScope.isAuthenticated = false;
        };
        AuthService.prototype.checkLoginStatus = function () {
            var expires = localStorage.getItem('expires');
            var now = (new Date().getTime() / 1000);
            var isLoggedIn = false;
            if (expires && parseInt(expires) > now) {
                isLoggedIn = true;
            }
            this.$rootScope.isAuthenticated = isLoggedIn;
            return isLoggedIn;
        };
        AuthService.$inject = [
            '$rootScope',
            '$http',
            '$q'
        ];
        return AuthService;
    }());
    users.AuthService = AuthService;
})(users || (users = {}));
angular.module('users')
    .service('AuthService', users.AuthService);
/// <reference path="../../typings/tsd.d.ts"/>
var users;
(function (users) {
    'use strict';
    var LoginController = (function () {
        function LoginController(AuthService, $state) {
            this.AuthService = AuthService;
            this.$state = $state;
            this.AuthService.logout();
        }
        LoginController.prototype.login = function () {
            var _this = this;
            this.loginError = null;
            this.AuthService.login(this.username, this.password)
                .then(function () {
                _this.$state.go('events');
            })
                .catch(function (err) {
                _this.loginError = 'Hmmm...vi kunne ikke logge dig ind. Har du angivet din email og adgangskode korrekt?';
            });
        };
        LoginController.$inject = [
            'AuthService',
            '$state'
        ];
        return LoginController;
    }());
    users.LoginController = LoginController;
})(users || (users = {}));
angular.module('users')
    .controller('LoginController', users.LoginController);
/// <reference path="../../typings/tsd.d.ts"/>
var users;
(function (users) {
    'use strict';
    function tokenInterceptor($q, $rootScope, $injector) {
        return {
            'request': function (config) {
                var token = localStorage.getItem('access_token');
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            'responseError': function (rejection) {
                if (rejection.status === 401) {
                    $rootScope.isAuthenticated = false;
                    var stateService = $injector.get('$state');
                    stateService.go('login');
                }
                return $q.reject(rejection);
            }
        };
    }
    users.tokenInterceptor = tokenInterceptor;
})(users || (users = {}));
angular.module('users')
    .factory('tokenInterceptor', users.tokenInterceptor);
