/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  interface IScope extends ng.IScope {
    isAuthenticated: boolean;
  }

  export class MembersController {

    allMembers: Array<Member>;
    members: Array<Member>;
    familyMemberships: Array<Member>;
    
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
          this.filterMembers();
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
          return m.hasOutstandingSubscriptionPayment && !m.familyMembershipNumber
        }

        return true;
      });    
      
      console.log('this.members', JSON.stringify(this.members.length));

      this.familyMemberships = 
        _.map(
          _.groupBy(
            _.filter(this.allMembers, m => m.familyMembershipNumber),
          m => m.familyMembershipNumber), 
        mg => {
          var family = _.cloneDeep(mg[0]);
          family.name = _.join(_.map(mg, m => m.name), ', ');
          family.number = _.join(_.map(mg, m => m.number), ', ');
          family.hasOutstandingSubscriptionPayment = _.findIndex(mg, m => m.hasOutstandingSubscriptionPayment) >= 0;
          return family;
        });
      
      this.familyMemberships = this.familyMemberships.filter(m => {
        if (this.hasOutstandingSubscriptionPaymentFilter) {
          return m.hasOutstandingSubscriptionPayment;
        }

        return true;
      });    

      console.log('this.members', JSON.stringify(this.members.length));
      
    }
    
  }
}

angular.module('members')
  .controller('MembersController', members.MembersController);
