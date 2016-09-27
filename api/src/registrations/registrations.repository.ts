import * as mongoose from 'mongoose';
import * as request from 'request';
import { IRegistrationData } from './registrations.registration.interface';
import { EventExcelGenerator } from './../events/event_excel_generator';
import { EventExcelGeneratorJson2Xls } from './../events/event_excel_generator_json2xls';


var registrationSchema = new mongoose.Schema({
    name: String,
    gender: String,
    eventId: String,
    email: String,
    birthYear: Number,
    disciplines: { type: {} }
});

var Registration = mongoose.model('Registration', registrationSchema);

export class RegistrationRepository {

    eventExcelGenerator: EventExcelGeneratorJson2Xls;

    constructor() {
        this.eventExcelGenerator = new EventExcelGeneratorJson2Xls();
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

    add(registration: IRegistrationData, ip: string) {
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

    getEventRegistrations(eventId: string) {
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
    
    getEventRegistrationsAsExcel(eventId: string) {
        let promise = new Promise((resolve, reject) => {

            console.log('generating event registrations excel file');

            this.eventExcelGenerator.generateEventExcelFile(eventId).then(filepath => {
                resolve(filepath);
            });
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
