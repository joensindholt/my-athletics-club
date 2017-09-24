/// <reference path="../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  export class MemberStatisticsController {

    date: string;
    statistics: any;
    totals: any;

    labels: any;
    series: any;
    data: any;

    static $inject = [
      'moment',
      'MembersService'
    ];

    constructor(
      private moment: moment.MomentStatic,
      private MembersService: MembersService
    ) {
      this.date = this.moment().format('YYYY-MM-DD');
      this.update();

    }

    update() {
      this.MembersService.getStatistics(this.date).then(statistics => {
        this.statistics = statistics;

        this.totals = {
          females: _.sumBy(statistics, (i: any) => i.genders.females),
          males: _.sumBy(statistics, (i: any) => i.genders.males),
          total: _.sumBy(statistics, (i: any) => i.genders.females + i.genders.males)
        }

        this.labels = _.map(this.statistics, (s: any) => s.age + ' år');;
        this.series = ['Piger', 'Drenge'];
        this.data = [
          _.map(this.statistics, (s: any) => s.genders.females),
          _.map(this.statistics, (s: any) => s.genders.males)
        ];
      });
    }
  }
}

angular.module('members')
  .controller('MemberStatisticsController', members.MemberStatisticsController);