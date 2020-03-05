/// <reference path="../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  export class MemberEditController {
    form: any;
    member: Member = new Member({});
    errorMessage: string;
    terminationDate: string;

    selectableTeams: Array<{ id: number; label: string }>;
    selectedTeam: string;
    selectableGenders: Array<{ id: number; label: string }>;
    selectedGender: string;

    messages: MemberMessage[];

    static $inject = ['$scope', '$state', '$window', 'moment', '$uibModal', 'MembersService', 'AuthService'];

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

      this.selectableTeams = this.MembersService.getTeamInfos();
      this.selectableGenders = this.MembersService.getGenderInfos();

      this.MembersService.get($state.params.id).then(response => {
        console.log('response', response);

        this.member = response.member;
        this.selectedTeam = response.member.team !== null ? response.member.team.toString() : null;
        this.selectedGender = response.member.gender !== null ? response.member.gender.toString() : null;

        this.messages = response.messages;
      });

      this.$scope.$on('family-membership-number-found', ($event, number) => {
        this.member.familyMembershipNumber = number;
      });
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

      if (!this.form.inputStartDate.$valid) {
        this.errorMessage = 'Indmeldelsesdatoen skal være i formatet: åååå-mm-dd';
        return;
      }

      member.team = this.selectedTeam ? parseInt(this.selectedTeam) : null;
      member.gender = this.selectedGender ? parseInt(this.selectedGender) : null;

      this.MembersService.update(member)
        .then(member => {
          toastr.success('Dine ændringer er gemt');
          setTimeout(() => this.$state.go('members'), 1000);
        })
        .catch(err => {
          toastr.error(err.statusText, err.status);
        });
    }

    terminateMembership(member: Member, $event: UIEvent) {
      this.$uibModal
        .open({
          templateUrl: 'members/modals/member.terminate.modal.controller.html',
          controller: 'MemberTerminateModalController',
          controllerAs: 'vm',
          resolve: {
            context: () => {
              return {
                memberId: member.id
              };
            }
          }
        })
        .result.then((terminationDate: string) => {
          toastr.success('Medlemmet er udmeldt pr. ' + terminationDate);
          this.$state.go('members');
        })
        .catch(err => {
          toastr.error(err.statusText, err.status);
        });
    }

    showLocalTime(date: string) {
      return this.moment(date)
        .locale('da')
        .format('LLL');
    }
  }
}

angular.module('members').controller('MemberEditController', members.MemberEditController);
