/// <reference path="../../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  interface IScope extends ng.IScope {
    isAuthenticated: boolean;
  }

  export class TerminatedMembersController {

    members: Array<any>;
    search: string;

    static $inject = [
      '$scope',
      'MembersService'
    ];

    constructor(
      private $scope: IScope,
      private membersService: MembersService
    ) {
      this.updateMemberList();
      this.listenForChildEvents();
    }

    updateMemberList() {
      this.membersService.getTerminatedMembers()
        .then(members => {
          this.members = _.orderBy(members, ['name']);
        })
        .catch(err => {
          toastr.error(err.statusText, err.status);
          throw err;
        });
    }

    listenForChildEvents() {
      this.$scope.$on('member-awaken', (event, member) => {
        member.terminationDate = null;
        this.membersService.update(member).then(() => {
          toastr.success(member.name + ' er genindmeldt');
          this.updateMemberList();
        });
      });
    }
  }
}

angular.module('members')
  .controller('TerminatedMembersController', members.TerminatedMembersController);
