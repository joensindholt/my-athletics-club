module members {
  'use strict';

  export function familyMembershipNumberFinderComponent() {
    return {
      templateUrl: 'members/family-membership-number-finder.component/family-membership-number-finder.component.html',
      controller: members.FamilyMembershipNumberFinderController,
      bindings: {
        member: '<'
      }
    }
  }

  export class FamilyMembershipNumberFinderController {
   
    private finding: boolean = false;

    static $inject = [
      '$scope',
      'MembersService'
    ];

    constructor(
      private $scope: ng.IScope,
      private membersService: MembersService
    ) {
    }

    findNumber() {
      this.finding = true;
      this.membersService.getAvailableFamilyMembershipNumber().then(number => {
        this.$scope.$emit('family-membership-number-found', number);
        this.finding = false;
      })
    }

  }
}

angular.module('members')
  .component('familyMembershipNumberFinder', members.familyMembershipNumberFinderComponent());
