import * as path from 'path';
import * as fs from 'fs';
import { IRegistration, Gender } from './registration';

var json2xls = require('json2xls');

export class RegistrationsExcelJsonGenerator {

  generateRegistrationsExcelJson(event: any, registrations: Array<IRegistration>): Promise<Array<{}>> {
    let promise = new Promise((resolve, reject) => {

      var json: Array<{}> = [];

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
            'Øvelse': discipline.short,
            'Seedning Resultat': discipline.personalRecord
          });

          isFirstDiscipline = false;
        });
      });

      resolve(json);

    });

    return promise;
  }
}