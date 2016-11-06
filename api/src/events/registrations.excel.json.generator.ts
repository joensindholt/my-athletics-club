import * as path from 'path';
import * as fs from 'fs';
import { IRegistration, Gender } from './registration';

var json2xls = require('json2xls');

export class RegistrationsExcelJsonGenerator {

  generateRegistrationsExcelJson(event: any, registrations: Array<IRegistration>): Promise<Array<{}>> {
    let promise = new Promise((resolve, reject) => {

      var json: Array<{}> = [];

      var lastName: string = null;
      var lastYear: string = null;
      var lastAgeClass: string = null;

      registrations.forEach((registration, index) => {

        var name = registration.name;
        var year = registration.birthYear;

        var disciplines = this.mergeDisciplinesAndExtraDisciplines(registration);

        var lastDisciplineAgeClass: string = null;
        
        disciplines.forEach((discipline, index) => {

          // dont write out class name when it's the same as the previous within the current registration          
          var ageClass = discipline.ageClass;
          if (ageClass === lastDisciplineAgeClass) {
            ageClass = '';
          }

          // show discipline name when id is -1 indicating "custom" discipline
          var disciplineOutput = discipline.id;
          if (discipline.id === '-1') {
            disciplineOutput = discipline.name;
          }

          json.push({
            'Navn': name,
            'Årgang': year,
            'Klasse': ageClass,
            'Øvelse': disciplineOutput,
            'Seedning Resultat': discipline.personalRecord
          });

          // after writing the first discipline for a registration we clear the name and birth year values
          name = '';
          year = '';

          lastDisciplineAgeClass = discipline.ageClass;
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