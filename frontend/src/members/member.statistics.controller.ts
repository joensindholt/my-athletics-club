/// <reference path="../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  export class MemberStatisticsController {
    year: string;
    statistics: any;
    totals: any;

    labels: any;
    series: any;
    data: any;

    static $inject = ['moment', 'MembersService'];

    constructor(private moment: moment.MomentStatic, private MembersService: MembersService) {
      this.year = this.moment()
        .subtract('years', 1)
        .format('YYYY');
      this.update();
    }

    update() {
      this.MembersService.getCfrStatistics(this.year).then(statistics => {
        console.log(statistics);

        this.statistics = statistics;

        this.totals = {
          females: _.sumBy(statistics, (i: any) => i.females),
          males: _.sumBy(statistics, (i: any) => i.males),
          total: _.sumBy(statistics, (i: any) => i.females + i.males)
        };

        this.labels = _.map(this.statistics, (s: any) => s.age + ' år');
        this.series = ['Piger', 'Drenge'];
        this.data = [_.map(this.statistics, (s: any) => s.females), _.map(this.statistics, (s: any) => s.males)];
      });
    }
  }
}

angular.module('members').controller('MemberStatisticsController', members.MemberStatisticsController);
