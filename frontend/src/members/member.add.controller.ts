/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  export class MemberAddController {

    form: any;
    member: Member = new Member({});
    errorMessage: string;
    birthYears: Array<number>;
    selectableTeams: Array<any>;

    static $inject = [
      '$scope',
      '$state',
      '$window',
      'moment',
      'MembersService',
      'AuthService'
    ];

    constructor(private $scope: ng.IScope,
                private $state,
                private $window: ng.IWindowService,
                private moment: moment.MomentStatic,
                private MembersService: MembersService,
                private AuthService: users.AuthService) {
      this.birthYears = this.MembersService.getAllowedBirthYears();
      this.member.startDate = moment(new Date()).format('YYYY-MM-DD');
      this.selectableTeams = this.MembersService.getTeamInfos();
    }

    addMember(member: Member) {
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

      this.MembersService.add(member).then(member => {
        toastr.info('Medlemmet er oprettet med medlemsnummer ' + member.number);
        setTimeout(() => this.$state.go('members'), 1000);
      });
    }
  }
}

angular.module('members')
  .controller('MemberAddController', members.MemberAddController);
