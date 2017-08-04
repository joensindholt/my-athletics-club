/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  interface IScope extends ng.IScope {
    isAuthenticated: boolean;
  }

  export class MembersController {

    allMembers: Array<Member>;
    members: Array<Member>;
    
    hasOutstandingSubscriptionPaymentFilter: boolean;

    static $inject = [
      '$scope',
      '$state',
      '$window',
      'moment',
      'MembersService',
      'AuthService'
    ];

    constructor(private $scope: IScope,
                private $state,
                private $window: ng.IWindowService,
                private moment: moment.MomentStatic,
                private MembersService: MembersService,
                private AuthService: users.AuthService) {
      this.updateMemberList();
      this.listenForChildEvents();
    }

    updateMemberList() {
      this.MembersService.getAll()
        .then(members => {
          this.allMembers = _.orderBy(members, ['name']);
          this.filterMembers(this.allMembers);
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
          _.remove(this.members, { id: member.id });
        });
      }
    }

    filterMembers() {
      this.members = this.allMembers.filter(m => {
        if (this.hasOutstandingSubscriptionPaymentFilter) {
          return m.hasOutstandingSubscriptionPayment === true && !m.familyMembershipNumber
        }

        return true;
      });      
    }
    
  }
}

angular.module('members')
  .controller('MembersController', members.MembersController);
