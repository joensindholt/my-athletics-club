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
    ];

    constructor(
    ) {
    }
  }
}

angular.module('members')
  .component('memberListItem', members.memberListItemComponent());