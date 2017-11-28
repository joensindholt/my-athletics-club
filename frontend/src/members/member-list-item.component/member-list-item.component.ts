module members {
  'use strict';

  export function memberListItemComponent() {
    return {
      templateUrl: 'members/member-list-item.component/member-list-item.component.html',
      controller: members.MemberListItemController,
      bindings: {
        member: '<'
      }
    }
  }

  export class MemberListItemController {

    member: members.Member;

    static $inject = [
      'MembersService'
    ];

    constructor(
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
  }
}

angular.module('members')
  .component('memberListItem', members.memberListItemComponent());