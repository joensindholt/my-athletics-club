import * as mongoose from 'mongoose';
import { ISysEvent } from './sysevent';

var sysEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date },
  userProfile: {
    email: { type: String }
  }
});

var SysEvent = mongoose.model('SysEvent', sysEventSchema);

export class SysEventsService {
  
  getAll() {
    let promise = new Promise((resolve, reject) => {
      console.log('querying sysevents from db');
      SysEvent.find((err, sysevents) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(sysevents);
      });
    });

    return promise;
  }

  add(sysevent: ISysEvent) {
    let promise = new Promise((resolve, reject) => {
      if (!sysevent.title) {
        reject('Missing title');
      }

      console.log('adding sysevent to db', sysevent);
      var syseventObj = new SysEvent(sysevent);
      syseventObj.save(function (err) {
        if (err) {
          reject(err);
          return
        }
        resolve(syseventObj);
      })
    });

    return promise;
  }
}
