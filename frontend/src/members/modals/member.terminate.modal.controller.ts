/// <reference path="../../../typings/tsd.d.ts"/>

declare var toastr: any;

module members {
  'use strict';

  export class MemberTerminateModalController {

    private memberTerminateModalForm: any;
    private terminationDate: string;

    static $inject = [
      '$uibModalInstance',
      'context',
      'MembersService'
    ];

    constructor(
      private $uibModalInstance,
      private context,
      private membersService: MembersService
    ) {
    }

    ok() {
      if (this.memberTerminateModalForm.inputTerminationDate.$error.required) {
        toastr.error('Du mangler at angive dato');
        return;
      }

      if (this.memberTerminateModalForm.inputTerminationDate.$error.pattern) {
        toastr.error('Datoen skal være i formatet: åååå-mm-dd');
        return;
      }

      this.membersService.terminateMembership(this.context.memberId, this.terminationDate).then(() => {
        this.$uibModalInstance.close(this.terminationDate);
      }).catch(err => {
        toastr.error(err.statusText, err.status);
      });

    }

    cancel() {
      this.$uibModalInstance.dismiss('cancel');
    }
  }
}

angular.module('members')
  .controller('MemberTerminateModalController', members.MemberTerminateModalController);