import { Injectable } from '@angular/core';

import * as moment from 'moment';

const format = 'DD-MM-YYYY';

@Injectable()
export class DateService {

  constructor() { }

  apiDateToString(apiDate: string): string {
    return apiDate ? moment(apiDate).format(format) : null;
  }

  clientDateToApiDate(clientDate: string): string {
    return clientDate ? moment(clientDate, format).format() : null;
  }
}
