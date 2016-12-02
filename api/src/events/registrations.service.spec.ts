import * as mocha from 'mocha';
import * as chai from 'chai';

import { EventsService } from './events.service';
import { RegistrationsService } from './registrations.service';

const expect = chai.expect;

describe("registrations service", () => {

  xit("send slack message", (done) => {

    var registrationsService = new RegistrationsService();

    registrationsService.sendSlackMessage({
      eventId: '123',
      name: 'Hans',
      email: 'joensindholt@gmail.com',
      birthYear: '2006',
      ageClass: 'D10',
      disciplines: [{
        id: '60M',
        name: '60 m',
        personalRecord: '123456'
      }],
      extraDisciplines: [{
        id: '100M',
        name: '100 m',
        personalRecord: '654',
        ageClass: 'D12'
      }],
      recaptcha: 'asd'
    }).then(() => {
      done();
    });
  });

});
