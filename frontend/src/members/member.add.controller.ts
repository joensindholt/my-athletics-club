/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  export class MemberAddController {

    member: Member = new Member({});
    errorMessage: string;
    birthYears: Array<number>;

    static $inject = [
      '$scope',
      '$state',
      '$window',
      'moment',
      'MembersService',
      'AuthService',
      'SysEventsService'
    ];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $window: ng.IWindowService,
      private moment: moment.MomentStatic,
      private MembersService: MembersService,
      private AuthService: users.AuthService,
      private SysEventsService: core.SysEventsService
    ) {
      this.SysEventsService.post('Member add shown');
      this.birthYears = this.MembersService.getAllowedBirthYears();
    }

    addMember(member: Member) {
      if (!member.name) {
        this.errorMessage = 'Du kan ikke oprette et medlem uden navn';
        return;
      }

      this.MembersService.add(member).then(member => {
        this.$state.go('members');
      });
    }
  }
}

angular.module('members')
  .controller('MemberAddController', members.MemberAddController);
