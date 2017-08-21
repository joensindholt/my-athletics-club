/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  interface IScope extends ng.IScope {
    isAuthenticated: boolean;
  }

  export class MembersController {

    allMembers: Array<any>;
    members: Array<any>;
    familyMemberships: Array<any>;
    search: string;
    filters: {
      hasOutstandingMembershipPaymentFilter?: boolean;
      genderFilter?: string;
      team?: string;
      birthDateNull?: boolean;
      birthDate?: string;
      startDateNull?: boolean;
      startDate?: string;
    }

    static $inject = [
      '$scope',
      '$state',
      '$window',
      '$filter',
      'moment',
      'MembersService',
      'AuthService'
    ];

    constructor(private $scope: IScope,
      private $state,
      private $window: ng.IWindowService,
      private $filter: ng.IFilterService,
      private moment: moment.MomentStatic,
      private membersService: MembersService,
      private authService: users.AuthService
    ) {
      this.updateMemberList();
      this.listenForChildEvents();
      this.filters = {};
    }

    updateMemberList() {
      this.membersService.getAll()
        .then(members => {
          // order members by name
          this.allMembers = _.orderBy(members, ['name']);

          // make team and gender enums searchable
          _.forEach(this.allMembers, m => {
            m.teamLabel = this.membersService.getTeamLabel(m.team);
            m.genderLabel = this.membersService.getGenderLabel(m.gender);
          });

          // filter members by search text and other filters
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

      console.log('ad', this.allMembers);

      this.members = this.allMembers.filter(m => {
        var includeMember = true;

        // filter by outstanding memberhip payment
        if (this.filters.hasOutstandingMembershipPaymentFilter) {
          includeMember = includeMember && m.hasOutstandingMembershipPayment && !m.familyMembershipNumber
        }

        // filter by gender
        switch (this.filters.genderFilter) {
          case 'female':
            includeMember = includeMember && m.gender === 1;
            break;
          case 'male':
            includeMember = includeMember && m.gender === 2;
            break;
          case 'null':
            includeMember = includeMember && !m.gender;
            break;
        }

        // filter by team
        switch (this.filters.team) {
          case '1':
            includeMember = includeMember && m.team === 1;
            break;
          case '2':
            includeMember = includeMember && m.team === 2;
            break;
          case '3':
            includeMember = includeMember && m.team === 3;
            break;
          case 'null':
            includeMember = includeMember && !m.team;
            break;
        }

        // filter by birth date existing
        if (this.filters.birthDateNull) {
          includeMember = includeMember && !m.birthDate;
        }

        // filter by start date existing
        if (this.filters.startDateNull) {
          includeMember = includeMember && !m.startDate;
        }

        return includeMember;
      });

      // filter by search
      this.members = this.$filter('filter')(this.members, this.search);

      // filter by typed birth date
      if (!this.filters.birthDateNull && this.filters.birthDate) {
        this.members = this.$filter('filter')(this.members, { birthDate: this.filters.birthDate });
      }

      // filter by typed start date
      if (!this.filters.startDateNull && this.filters.startDate) {
        this.members = this.$filter('filter')(this.members, { startDate: this.filters.startDate });
      }

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
        if (this.filters.hasOutstandingMembershipPaymentFilter) {
          return m.hasOutstandingMembershipPayment;
        }

        return true;
      });

      this.familyMemberships = this.$filter('filter')(this.familyMemberships, this.search);
    }

    chargeMemberships() {
      if (confirm('Er du sikker på at du vil opkræve alle medlemmer?')) {
        toastr.info('Opkræver alle medlemmer. Vent venligst...');
        this.membersService.chargeMemberships().then(() => {
          toastr.success('Alle medlemmer er nu registreret som havende udestående kontingent', 'Opkrævning gennemført');
          this.updateMemberList();
        }).catch(err => {
          toastr.error(err.statusText, err.status);
        });
      }
    }

    searchChanged() {
      this.updateMemberList();
    }

    getCsvMembers() {
      return _.map(_.concat(this.members, this.familyMemberships), m => {
        return {
          id: m.id,
          number: m.number,
          name: m.name,
          genderLabel: m.genderLabel,
          teamLabel: m.teamLabel,
          email: m.email,
          email2: m.email2,
          familyMembershipNumber: m.familyMembershipNumber,
          birthDate: m.birthDate,
          hasOutstandingMembershipPayment: m.hasOutstandingMembershipPayment,
          startDate: m.startDate,
          terminationDate: m.terminationDate
        };
      });
    }

    getCsvHeaders() {
      return ['Id', 'Nummer', 'Navn', 'Køn', 'Hold', 'Email', 'Email 2', 'Fam. medl. nummer', 'Fødselsdato', 'Udest. kontingent',
        'Indmeldelsesdato', 'Udmeldelsesdato'];
    }
  }
}

angular.module('members')
  .controller('MembersController', members.MembersController);
