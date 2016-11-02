import * as mongoose from 'mongoose';
import * as request from 'request';
import { IRegistration } from './registration';
import { RegistrationsExcelJsonGenerator } from './registrations.excel.json.generator';
import { EventsService } from './events.service';

var registrationSchema = new mongoose.Schema({
  eventId: String,
  name: String,
  email: String,
  birthYear: String,
  ageClass: String,
  disciplines: { type: {} },
  extraDisciplines: { type: {} }
});

var Registration = mongoose.model('Registration', registrationSchema);

export class RegistrationsService {

  private registrationsExcelJsonGenerator: RegistrationsExcelJsonGenerator;
  private eventsService: EventsService;

  constructor() {
    this.registrationsExcelJsonGenerator = new RegistrationsExcelJsonGenerator();
    this.eventsService = new EventsService();
  }

  getAll() {
    let promise = new Promise((resolve, reject) => {

      console.log('querying registrations from db');

      Registration.find((err, registrations) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(registrations);
      });
    });

    return promise;
  }

  add(registration: IRegistration, ip: string) {
    let promise = new Promise((resolve, reject) => {

      // validate event id
      if (!registration.eventId) {
        reject('Missing eventId');
      }

      // validate name existing
      if (!registration.name) {
        reject('Missing name');
      }

      // validate recaptcha
      if (!registration.recaptcha) {
        reject('missing recaptcha response');
      }

      this.validateRecaptcha(registration.recaptcha, ip).then(() => {
        console.log('adding registration to db', registration);

        var registrationObj = new Registration(registration);
        registrationObj.save(function (err) {
          if (err) {
            reject(err);
            return
          }

          resolve(registrationObj);
        })
      })
        .catch(err => {
          reject(err);
        });
    });

    return promise;
  }

  getEventRegistrations(eventId: string): Promise<Array<IRegistration>> {
    let promise = new Promise((resolve, reject) => {

      console.log('querying event registrations from db');

      Registration.find({ eventId: eventId }, (err, registrations) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(registrations);
      });
    });

    return promise;
  }

  getRegistrationsExcelJson(eventId: string): Promise<Array<{}>> {
    let promise = new Promise((resolve, reject) => {

      console.log('generating event registrations excel file');

      var eventPromise = this.eventsService.get(eventId);
      var registrationsPromise = this.getEventRegistrations(eventId);

      Promise.all([eventPromise, registrationsPromise]).then(values => {
        var event = values[0];
        var registrations = values[1];
        this.registrationsExcelJsonGenerator.generateRegistrationsExcelJson(event, registrations).then(json => {
          resolve(json);
        });
      })
    });

    return promise;
  }

  validateRecaptcha(recaptcha: any, ip: string) {
    let promise = new Promise((resolve, reject) => {
      request.post({
        url: 'https://www.google.com/recaptcha/api/siteverify',
        form: {
          secret: '6Ldb1ykTAAAAAGRlDMsO54F04rk-CbTsGA4bk71f',
          response: recaptcha,
          remoteip: ip
        }
      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let success = JSON.parse(body).success;
          if (success) {
            resolve();
          } else {
            reject('recaptacha validation did not return success');
          }
        } else {
          reject('invalid response from google recaptcha api');
        }
      });
    });

    return promise;
  }
}