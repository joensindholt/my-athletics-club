/// <reference path="../../../typings/tsd.d.ts"/>

module core {
    export function topbar() {
        return <ng.IComponentOptions>{
            bindings: {
            },
            controller: core.TopBarController,
            controllerAs: 'vm',
            templateUrl: "core/topbar/topbar.html",
            restrict: 'E',
            replace: true
        };
    }

    export class TopBarController{

        isAuthenticated: boolean;
        isMembersEnabled: boolean;

        static $inject = [
            '$state',
            '$rootScope',
            'JwtAuthService',
            'FeatureTogglesService',
        ];

        constructor(
            private $state: ng.ui.IStateService,
            private $rootScope: ng.IRootScopeService,
            private JwtAuthService: users.JwtAuthService,
            private FeatureTogglesService: featuretoggles.FeatureTogglesService
        ) {
            this.init();
        }

        init() {
             this.$rootScope.$watch('isAuthenticated', (value: boolean) => {
                this.isAuthenticated = value;
            });
            
            this.isMembersEnabled = this.FeatureTogglesService.isMembersEnabled();
        }

        logout() {
            this.JwtAuthService.logout();
            this.$state.go('home');
        }
    }
}

angular.module('core')
    .component('topbar', core.topbar());