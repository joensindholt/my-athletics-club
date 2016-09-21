import * as mongoose from 'mongoose';
import { IEventData } from './events.event.interface';

var eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date },
    address: { type: String },
    disciplines: { type: {} },
    registrationPeriodStartDate: { type: Date },
    registrationPeriodEndDate: { type: Date }
});

var Event = mongoose.model('Event', eventSchema);

export class EventRepository {
    constructor() {
    }

    getAll() {
        let promise = new Promise((resolve, reject) => {
            console.log('querying events from db');
            Event.find((err, events) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(events);
            });
        });

        return promise;
    }

    add(event: IEventData) {
        let promise = new Promise((resolve, reject) => {

            // validate title existing
            if (!event.title) {
                reject('Missing title');
            }

            console.log('adding event to db', event);

            if (event._id == -1) {
                delete event._id;
            }

            var eventObj = new Event(event);
            eventObj.save(function (err) {
                if (err) {
                    reject(err);
                    return
                }

                resolve(eventObj);
            })
        });

        return promise;
    }

    update(id: number, event: IEventData) {
        let promise = new Promise((resolve, reject) => {
            // validate title existing
            if (!event.title) {
                reject('Missing title');
            }

            // validate date existing
            if (!event.date) {
                reject('Missing date');
            }

            console.log('updating event in db', event);

            Event.findOneAndUpdate({ _id: id }, event, function (err) {
                if (err) {
                    reject(err);
                    return
                }

                resolve(event);
            })
        });

        return promise;
    }

    delete(id: number) {
        let promise = new Promise((resolve, reject) => {
            console.log('deleting event from db', id);
            Event.remove({ _id: id }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });

        return promise;
    }
}
