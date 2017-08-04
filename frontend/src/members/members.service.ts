/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  export class MembersService {

    private API_PATH = globals.apiUrl;;

    static $inject = ['$http', '$q'];

    constructor(
      private $http: ng.IHttpService,
      private $q: ng.IQService
    ) {
    }

    getAll(): ng.IPromise<Array<Member>> {
      var deferred = this.$q.defer<Array<Member>>();
      
      this.$http.get(this.API_PATH + '/members').then((response: any) => {
        var members = _.map(response.data.items, (memberData) => {
          return new Member(memberData);
        });
        deferred.resolve(members)
      }).catch(err => {
        deferred.reject(err);
      });

      return deferred.promise;
    }

    add(member: Member): ng.IPromise<Member> {
      var deferred = this.$q.defer<Member>();
      // give it a temporary id
      member.id = '-1';
      // ... and post to server
      this.$http.post(this.API_PATH + '/members', member)
        .then(response => {
          var newMember = new Member(response.data);
          deferred.resolve(newMember)
        }).catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    get(id: string): ng.IPromise<Member> {
      var deferred = this.$q.defer<Member>();

      this.$http.get(this.API_PATH + '/members/' + id).then((response: any) => {
        var member = new Member(response.data);
        deferred.resolve(member);
      }).catch(err => {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    update(member: Member): ng.IPromise<Member> {
      var deferred = this.$q.defer<Member>();

      this.$http.put(this.API_PATH + '/members/' + member.id, member).then(response => {
        deferred.resolve();
      }).catch(err => {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    delete(member: Member): ng.IPromise<Member> {
      var deferred = this.$q.defer<Member>();

      this.$http.delete(this.API_PATH + '/members/' + member.id).then(response => {
        deferred.resolve();
      }).catch(err => {
        deferred.reject(err);
      })

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
      birthYears.push((minimumYear - 1) + ' eller før');

      return birthYears;
    }
  }
}

angular.module('members')
  .service('MembersService', members.MembersService);
