/// <reference path="../../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  export class MemberAddTemplateChangedModalController {
    static $inject = ['$uibModalInstance', 'context'];

    constructor(private $uibModalInstance, private context) {}

    keep() {
      this.$uibModalInstance.close(false);
    }

    change() {
      this.$uibModalInstance.close(true);
    }
  }
}

angular
  .module('members')
  .controller('MemberAddTemplateChangedModalController', members.MemberAddTemplateChangedModalController);
