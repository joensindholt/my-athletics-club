/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  interface IScope extends ng.IScope {
    isAuthenticated: boolean;
  }

  export class MembersController {

    members: Array<Member>;

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
      private $scope: IScope,
      private $state,
      private $window: ng.IWindowService,
      private moment: moment.MomentStatic,
      private MembersService: MembersService,
      private AuthService: users.AuthService,
      private SysEventsService: core.SysEventsService
    ) {
      this.SysEventsService.post('Member list shown');
      this.updateMemberList();
      this.listenForChildEvents();
    }

    updateMemberList() {
      this.MembersService.getAll()
        .then(members => {
          this.members = _.orderBy(members, ['name']);
        })
        .catch(err => {
          throw err;
        });
    }

    addMember() {
      alert('Not implmented yet');
    }

    listenForChildEvents() {
      this.$scope.$on('member-updated', member => {
        this.updateMemberList();
      });

      this.$scope.$on('member-deleted', () => {
        this.updateMemberList();
      });
    }

    handleMemberDeleteClicked(member: Member) {
      if (this.$window.confirm('Er du sikker?')) {
        this.MembersService.delete(member).then(() => {
          _.remove(this.members, { _id: member._id });
        });
      }
    }
  }
}

angular.module('members')
  .controller('MembersController', members.MembersController);
