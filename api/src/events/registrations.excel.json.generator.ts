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
        var year = registration.birthYear;
        var ageClass = registration.ageClass

        var disciplines = this.mergeDisciplinesAndExtraDisciplines(registration);

        var lastDiscipline: any = null;

        disciplines.forEach((discipline, index) => {

          json.push({
            'Navn': name,
            'Årgang': year,
            'Klasse': ageClass,
            'Øvelse': discipline.id,
            'Seedning Resultat': discipline.personalRecord
          });

          lastDiscipline = discipline;
        });
      });

      resolve(json);

    });

    return promise;
  }

  mergeDisciplinesAndExtraDisciplines(registration: IRegistration) {
    var disciplines: Array<any> = [];

    if (registration.disciplines && registration.disciplines.length > 0) {
      disciplines = disciplines.concat(registration.disciplines.map((discipline: any) => {
        discipline.ageClass = registration.ageClass;
        discipline.id = discipline.id || discipline.name;
        return discipline;
      }));
    }

    if (registration.extraDisciplines && registration.extraDisciplines.length > 0) {
      disciplines = disciplines.concat(registration.extraDisciplines.map((discipline: any) => {
        discipline.id = discipline.id || discipline.name;
        return discipline;
      }));
    }

    return disciplines;
  }
}