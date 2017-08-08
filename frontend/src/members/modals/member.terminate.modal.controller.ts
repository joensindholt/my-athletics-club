/// <reference path="../../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  export class MemberTerminateModalController {

    static $inject = [
      '$uibModalInstance'
    ];

    constructor(
      private $uibModalInstance
    ) {
      this.terminationDate = '123';
    }

    ok() {
      console.log('this', this);
      
      console.log('terminationDate', this.vm.terminationDate);
      console.log('form', this.$uibModalInstance.memberTerminateModalForm);
      

      if (!this.terminationDate) {
        toastr.error('Du mangler at angive dato');
        return;
      }

      if (!this.$uibModalInstance.memberTerminateModalForm.terminationDate.$valid) {
        toastr.error('Datoen skal være i formatet: åååå-mm-dd');
        return;
      }

      this.$uibModalInstance.close(this.terminationDate);
    }

    cancel() {
      this.$uibModalInstance.dismiss('cancel');
    }
  }
}

angular.module('members')
  .controller('MemberTerminateModalController', members.MemberTerminateModalController);