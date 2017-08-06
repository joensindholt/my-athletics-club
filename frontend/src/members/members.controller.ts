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

    hasOutstandingMembershipPaymentFilter: boolean;

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
      private membersService: MembersService,
      private authService: users.AuthService
    ) {
      this.updateMemberList();
      this.listenForChildEvents();
    }

    updateMemberList() {
      this.membersService.getAll()
        .then(members => {
          this.allMembers = _.orderBy(members, ['name']);
          this.filterMembers();
        })
        .catch(err => {
          toastr.error(err.statusText, err.status);
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
        this.membersService.delete(member).then(() => {
          _.remove(this.members, { id: member.id });
        });
      }
    }

    filterMembers() {
      this.members = this.allMembers.filter(m => {
        if (this.hasOutstandingMembershipPaymentFilter) {
          return m.hasOutstandingMembershipPayment && !m.familyMembershipNumber
        }

        return true;
      });

      this.familyMemberships =
        _.map(
          _.groupBy(
            _.filter(this.allMembers, m => m.familyMembershipNumber),
            m => m.familyMembershipNumber),
          mg => {
            var family = _.cloneDeep(mg[0]);
            family.name = _.join(_.map(mg, m => m.name), ', ');
            family.number = _.join(_.map(mg, m => m.number), ', ');
            family.hasOutstandingMembershipPayment = _.findIndex(mg, m => m.hasOutstandingMembershipPayment) >= 0;
            return family;
          });

      this.familyMemberships = this.familyMemberships.filter(m => {
        if (this.hasOutstandingMembershipPaymentFilter) {
          return m.hasOutstandingMembershipPayment;
        }

        return true;
      });
    }

    chargeMemberships() {
      toastr.info('Opkræver alle medlemmer. Vent venligst...');
      this.membersService.chargeMemberships().then(() => {
        toastr.success('Alle medlemmer er nu registreret som havende udestående kontingent', 'Opkrævning gennemført');
        this.updateMemberList();
      }).catch(err => {
        toastr.error(err.statusText, err.status);
      })
    }
  }
}

angular.module('members')
  .controller('MembersController', members.MembersController);
