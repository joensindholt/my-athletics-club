import * as mongoose from 'mongoose';
import { IMemberData } from './members.member.interface';

var memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    birthYear: { type: Number }
});

var Member = mongoose.model('Member', memberSchema);

export class MembersRepository {
    constructor() {
    }

    getAll() {
        let promise = new Promise((resolve, reject) => {
            console.log('querying members from db');
            Member.find((err, members) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(members);
            });
        });

        return promise;
    }

    add(member: IMemberData) {
        let promise = new Promise((resolve, reject) => {

            // validate title existing
            if (!member.name) {
                reject('Missing member name');
            }

            console.log('adding member to db', member);

            var memberObj = new Member(member);
            memberObj.save(function (err) {
                if (err) {
                    reject(err);
                    return
                }

                resolve(memberObj);
            })
        });

        return promise;
    }

    update(id: string, member: IMemberData) {
        let promise = new Promise((resolve, reject) => {
            // validate name existing
            if (!member.name) {
                reject('Missing member name');
            }

            console.log('updating member in db', member);

            Member.findOneAndUpdate({_id: id}, member, function (err) {
                if (err) {
                    reject(err);
                    return
                }

                resolve(member);
            })
        });

        return promise;
    }

    delete(id: string) {
        let promise = new Promise((resolve, reject) => {
            console.log('deleting member from db', id);
            Member.remove({ _id: id }, (err) => {
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