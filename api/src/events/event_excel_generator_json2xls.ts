import * as path from 'path';
import * as fs from 'fs';
import { IRegistrationData, Gender } from './../registrations/registrations.registration.interface';

var json2xls = require('json2xls');

export class EventExcelGeneratorJson2Xls {
    generateEventExcelFile(event: any, registrations: Array<IRegistrationData>) {
        let promise = new Promise((resolve, reject) => {

            var json: Array<any> = [];

            registrations.forEach((registration, index) => {
                var name = registration.name;
                var year = registration.birthYear.toString();
                var classAgeGroup = new Date().getFullYear() - registration.birthYear;
                var classGender = registration.gender === Gender.female ? 'P' : 'D';
                var _class = classGender + classAgeGroup;
                
                var isFirstDiscipline = true;
                registration.disciplines.forEach((discipline, index) => {

                    if (!isFirstDiscipline) {
                        name = '';
                        year = '';
                        _class = '';
                    }
                    
                    json.push({
                        'Navn': name,
                        'Årgang': year,
                        'Klasse': _class,
                        'Øvelse': discipline.name,
                        'Seedning Resultat': discipline.personalRecord
                    });

                    isFirstDiscipline = false;
                });
            });

            var xls = json2xls(json);

            var rootPath = path.dirname(require.main.filename);
            var savePath = rootPath + '/events/event_registrations_template_out.xlsx';
            fs.writeFileSync(savePath, xls, 'binary');

            resolve();

        });

        return promise;
    }
}