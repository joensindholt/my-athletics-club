/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  export class MembersService {

    private API_PATH = globals.apiUrl;;

    private members: Array<Member>;
    private getAllPromise: ng.IPromise<{}>;

    static $inject = ['$http', '$q'];

    constructor(
      private $http: ng.IHttpService,
      private $q: ng.IQService
    ) {
    }

    getAll(): ng.IPromise<Array<Member>> {

      if (this.getAllPromise) {
        return this.getAllPromise;
      }

      var deferred = this.$q.defer();
      // if we have cached members - use those 
      if (this.members) {
        deferred.resolve(this.members);
        return deferred.promise;
      }
      // ... else get from server
      this.$http.get(this.API_PATH + '/members').then(response => {
        // put in cache
        this.members = _.map(<Array<any>>response.data, (memberData) => {
          return new Member(memberData);
        });
        // ... and return
        deferred.resolve(this.members)
      }).catch(err => {
        deferred.reject(err);
      });

      this.getAllPromise = deferred.promise;

      return this.getAllPromise;
    }

    add(member: Member): ng.IPromise<Member> {
      var deferred = this.$q.defer();
      // give it a temporary id
      member._id = '-1';
      // ... and post to server
      this.$http.post(this.API_PATH + '/members', member)
        .then(response => {
          var newMember = new Member(response.data);
          this.members.push(newMember);
          deferred.resolve(newMember)
        }).catch(err => {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    get(id: string): ng.IPromise<Member> {
      var deferred = this.$q.defer();

      this.getAll().then(members => {
        const member = _.find(members, { _id: id });
        deferred.resolve(member);
      }).catch(err => {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    update(member: Member): ng.IPromise<Member> {
      var deferred = this.$q.defer();

      this.$http.post(this.API_PATH + '/members/' + member._id, member).then(response => {
        deferred.resolve();
      }).catch(err => {
        deferred.reject(err);
      })

      return deferred.promise;
    }

    delete(member: Member): ng.IPromise<Member> {
      var deferred = this.$q.defer();
      // remove from cached list
      _.remove(this.members, e => e._id === member._id);
      // ... and delete from server
      this.$http.delete(this.API_PATH + '/members/' + member._id).then(response => {
        deferred.resolve();
      }).catch(err => {
        // re-add to list if error occured
        this.members.push(member);
        // ... and reject
        deferred.reject(err);
      })

      return deferred.promise;
    }

    getAllowedBirthYears(): Array<number> {
      var currentYear = new Date().getFullYear();
      var maximumYear = currentYear - 4 + 1;
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
