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
            'AuthService',
            'FeatureTogglesService',
        ];

        constructor(
            private $state: ng.ui.IStateService,
            private AuthService: users.AuthService,
            private FeatureTogglesService: featuretoggles.FeatureTogglesService
        ) {
            this.isAuthenticated = this.AuthService.isAuthenticated;
            this.isMembersEnabled = this.FeatureTogglesService.isMembersEnabled();
        }

        logout() {
            this.AuthService.logout();
            this.$state.go('home');
        }
    }
}

angular.module('core')
    .component('topbar', core.topbar());