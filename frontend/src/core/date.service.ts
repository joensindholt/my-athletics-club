/// <reference path="../../typings/tsd.d.ts"/>

module core {
  'use strict';

  export class DateService {

    constructor() { }

    /* Parses a ISO8601 date string to  */
    parseDateAsCopenhagenTime(dateString) {
      if (!dateString) {
        return null;
      }

      // If we get a date with timezone we ignore it by removing the time zone indicator
      if (dateString[dateString.length - 1] === 'Z') {
        dateString = dateString.substring(0, dateString.length - 1);
      }

      return new Date(dateString + '+' + this.getTimezoneOffsetString());

    }

    getTimezoneOffsetString() {
      var timezoneOffset = new Date().getTimezoneOffset();

      if (timezoneOffset === -120) {
        return '0200';
      } else if (timezoneOffset === -60) {
        return '0100';
      }

      throw new Error('Could not resolve timezone offset string');
    }
  }
}

angular.module('core')
  .service('DateService', core.DateService);
