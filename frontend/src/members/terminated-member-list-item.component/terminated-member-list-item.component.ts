module members {
  'use strict';

  export function terminatedMemberListItemComponent() {
    return {
      templateUrl: 'members/terminated-member-list-item.component/terminated-member-list-item.component.html',
      controller: members.TerminatedMemberListItemController,
      bindings: {
        member: '<'
      }
    }
  }

  export class TerminatedMemberListItemController {

    member: members.Member;

    static $inject = [
      '$scope',
      'MembersService'
    ];

    constructor(
      private $scope: ng.IScope,
      private membersService: MembersService
    ) {
    }

    getMemberGender() {
      if (this.member.gender !== null) {
        return this.membersService.getGenderLabel(this.member.gender);
      } else {
        return null;
      }
    } 

    getMemberTeam() {
      if (this.member.team !== null) {
        return this.membersService.getTeamLabel(this.member.team);
      } else {
        return null;
      }
    }

    awaken() {
      this.$scope.$emit('member-awaken', this.member);
    }
  }
}

angular.module('members')
  .component('terminatedMemberListItem', members.terminatedMemberListItemComponent());