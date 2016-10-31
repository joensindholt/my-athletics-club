module events {
  'use strict';

  export function eventAddressComponent() {
    return {
      templateUrl: 'events/address.component/event.address.component.html',
      controller: events.EventAddressComponentController,
      bindings: {
        address: '<',
        editable: '<',
        onChange: '&'
      }
    }
  }

  export class EventAddressComponentController {

    trustedMapUrl: any;
    address: string;
    editable: boolean = false;

    static $inject = [
      '$scope',
      '$sce'
    ];

    constructor(
      private $scope: ng.IScope,
      private $sce: ng.ISCEService
    ) {
      this.$scope.$watch('$ctrl.address', () => { this.onAddressChanged(); });
    }

    onAddressChanged() {
      if (this.address) {
        var strippedAddress = this.address.replace(/<[^>]+>/gm, '');
        this.trustedMapUrl = this.$sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyC-0IZYk7mmRswHapPmWnSpMa6i2kHnP9I&q=' + strippedAddress);
      }
      else {
        this.trustedMapUrl = false;
      }
    }
  }
}

angular.module('events')
  .component('eventAddress', events.eventAddressComponent());