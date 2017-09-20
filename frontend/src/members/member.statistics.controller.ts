/// <reference path="../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  export class MemberStatisticsController {

    statistics: any;
    totals: any;

    static $inject = [
      'MembersService'
    ];

    constructor(
      private MembersService: MembersService
    ) {
      this.MembersService.getStatistics().then(statistics => {
        console.log('asd', statistics);
        this.statistics = statistics;
        this.totals = {
          female: _.sumBy(statistics, (i: any) => i.genders.female),
          male: _.sumBy(statistics, (i: any) => i.genders.male),
          total: _.sumBy(statistics, (i: any) => i.genders.female + i.genders.male)
        }
      });
    }
  }
}

angular.module('members')
  .controller('MemberStatisticsController', members.MemberStatisticsController);
