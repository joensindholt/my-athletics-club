/// <reference path="../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  export class MemberEditController {

    form: any;
    member: Member = new Member({});
    errorMessage: string;
    terminationDate: string;

    static $inject = [
      '$scope',
      '$state',
      '$window',
      'moment',
      '$uibModal',
      'MembersService',
      'AuthService'
    ];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $window: ng.IWindowService,
      private moment: moment.MomentStatic,
      private $uibModal,
      private MembersService: MembersService,
      private AuthService: users.AuthService
    ) {
      if (!$state.params.id) {
        $state.go('home');
        return;
      }

      if (!AuthService.isAuthenticated) {
        $state.go('home');
        return;
      }

      this.MembersService.get($state.params.id).then(member => this.member = member);
    }

    updateMember(member: Member) {
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

      this.MembersService.update(member).then(member => {
        toastr.success('Dine ændringer er gemt');
        setTimeout(() => this.$state.go('members'), 1000);
      });
    }

    terminateMembership(member: Member, $event: UIEvent) {
      this.$uibModal.open({
        templateUrl: 'members/modals/member.terminate.modal.controller.html',
        controller: 'MemberTerminateModalController',
        controllerAs: 'vm',
        resolve: {
          context: () => {
            return {
              memberId: member.id
            }
          }
        }
      }).result.then((terminationDate: string) => {
        toastr.success('Medlemmet er udmeldt pr. ' + terminationDate);
        this.$state.go('members');
      });
    }
  }
}

angular.module('members')
  .controller('MemberEditController', members.MemberEditController);
