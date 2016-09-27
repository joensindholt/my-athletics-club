import * as path from 'path';
var xlsx = require('xlsx');

export class EventExcelGenerator {
    generateEventExcelFile(event: any) {
        let promise = new Promise((resolve, reject) => {
            
            try {
            
                var rootPath = path.dirname(require.main.filename);
                var workbook = xlsx.readFile(rootPath + '/events/event_registrations_template.xlsx');
                var sheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[sheetName];

                // Lets input a value
                var cell = worksheet['P649'];
                console.log('got cell', cell);
                worksheet['A1'].w = 'Hans Peter Knud';
                console.log('set A5 value');

                var savePath = rootPath + '/events/event_registrations_template_out.xlsx';      
                xlsx.writeFile(workbook, savePath)

                resolve();
            } catch (err) {
                console.log(err);
                reject(err);
            }

        });

        return promise;
    }
}