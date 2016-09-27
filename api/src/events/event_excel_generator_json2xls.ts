import * as path from 'path';
import * as fs from 'fs';
var json2xls = require('json2xls');

export class EventExcelGeneratorJson2Xls {
    generateEventExcelFile(event: any) {
        let promise = new Promise((resolve, reject) => {

            var json = [{
                foo: 'bar',
                qux: 'moo',
                poo: 123,
                stux: new Date()
            },
            {
                foo: 'bar',
                qux: 'moo',
                poo: 345,
                stux: new Date()
            }];


            var xls = json2xls(json);

            var rootPath = path.dirname(require.main.filename);
            var savePath = rootPath + '/events/event_registrations_template_out.xlsx';
            fs.writeFileSync(savePath, xls, 'binary');

            resolve();

        });

        return promise;
    }
}