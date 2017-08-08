/// <reference path="../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  export class MemberEditController {

    form: any;
    member: Member = new Member({});
    errorMessage: string;

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
        toastr.info('Dine ændringer er gemt');
        setTimeout(() => this.$state.go('members'), 1000);
      });
    }

    terminateMembership(member: Member, $event: UIEvent) {

      var modalInstance = this.$uibModal.open({
        templateUrl: 'members/modals/member.terminate.modal.controller.html',
        controller: 'MemberTerminateModalController',
        controllerAs: 'vm'
      });

      modalInstance.result.then((terminationDate: string) => {
        console.log('terminationDate', terminationDate);
      });

      // if (confirm(`Slet ${member.name}?`)) {
      //   this.MembersService.delete(member).then(() => {
      //     this.$state.go('members');
      //   });
      // }
    }
  }
}

angular.module('members')
  .controller('MemberEditController', members.MemberEditController);
