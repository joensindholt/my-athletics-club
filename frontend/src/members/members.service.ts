/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  export class MembersService {
    private API_PATH = globals.apiUrl;

    static $inject = ['$http', '$q'];

    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {}

    getAll(): ng.IPromise<Array<Member>> {
      var deferred = this.$q.defer<Array<Member>>();

      this.$http
        .get(this.API_PATH + '/members')
        .then((response: any) => {
          var members = _.map(response.data.items, memberData => {
            return new Member(memberData);
          });
          deferred.resolve(members);
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    getTerminatedMembers(): ng.IPromise<Array<Member>> {
      var deferred = this.$q.defer<Array<Member>>();

      this.$http
        .get(this.API_PATH + '/members/terminated')
        .then((response: any) => {
          var members = _.map(response.data.items, memberData => {
            return new Member(memberData);
          });
          deferred.resolve(members);
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    add(member: Member): ng.IPromise<Member> {
      var deferred = this.$q.defer<Member>();
      // give it a temporary id
      member.id = '-1';

      // ... and post to server
      this.$http
        .post(this.API_PATH + '/members', member)
        .then(response => {
          var newMember = new Member(response.data);
          deferred.resolve(newMember);
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    get(id: string): ng.IPromise<Member> {
      var deferred = this.$q.defer<Member>();

      this.$http
        .get(this.API_PATH + '/members/' + id)
        .then((response: any) => {
          var member = new Member(response.data);
          deferred.resolve(member);
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    update(member: Member): ng.IPromise<Member> {
      var deferred = this.$q.defer<Member>();

      this.$http
        .put(this.API_PATH + '/members/' + member.id, member)
        .then(response => {
          deferred.resolve();
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    getAllowedBirthYears(): Array<number> {
      var currentYear = new Date().getFullYear();
      var maximumYear = currentYear - 2 + 1;
      var minimumYear = currentYear - 19 - 1;

      var birthYears = [];
      for (var i = maximumYear; i >= minimumYear; i--) {
        birthYears.push(i);
      }
      birthYears.push(minimumYear - 1 + ' eller før');

      return birthYears;
    }

    chargeMemberships(): ng.IPromise<{}> {
      var deferred = this.$q.defer<Member>();

      this.$http
        .post(this.API_PATH + '/members/charge-all', {})
        .then(response => {
          deferred.resolve();
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    terminateMembership(id: string, terminationDate: string): ng.IPromise<{}> {
      var deferred = this.$q.defer<Member>();

      this.$http
        .post(this.API_PATH + '/members/terminate', {
          memberId: id,
          terminationDate: terminationDate
        })
        .then(response => {
          deferred.resolve();
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    getTeamInfos() {
      return [
        { id: 1, label: 'Miniholdet' },
        { id: 2, label: 'Mellemholdet' },
        { id: 3, label: 'Storeholdet' },
        { id: 4, label: 'Voksenatletik' }
      ];
    }

    getTeamLabel(id: number) {
      if (id === null) {
        return null;
      } else {
        return _.find(this.getTeamInfos(), i => i.id === id).label;
      }
    }

    getGenderInfos() {
      return [
        { id: 1, label: 'Pige' },
        { id: 2, label: 'Dreng' }
      ];
    }

    getGenderLabel(id: number) {
      if (id === null) {
        return null;
      } else {
        return _.find(this.getGenderInfos(), i => i.id === id).label;
      }
    }

    getStatistics(date: string): ng.IPromise<any> {
      var deferred = this.$q.defer<Member>();

      this.$http
        .get(this.API_PATH + '/members/statistics?date=' + date)
        .then((response: any) => {
          deferred.resolve(response.data);
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    getCfrStatistics(year: string): ng.IPromise<any> {
      var deferred = this.$q.defer<Member>();

      this.$http
        .get(this.API_PATH + '/members/statistics/cfr.json?year=' + year)
        .then((response: any) => {
          deferred.resolve(response.data);
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    getAvailableFamilyMembershipNumber(): ng.IPromise<Number> {
      var deferred = this.$q.defer<Number>();

      this.$http
        .get(this.API_PATH + '/members/available-family-membership-number')
        .then((response: any) => {
          deferred.resolve(response.data.number);
        })
        .catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }
  }
}

angular.module('members').service('MembersService', members.MembersService);
