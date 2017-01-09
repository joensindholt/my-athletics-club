import * as mongoose from 'mongoose';
import { IMember } from './member';

var memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  postalCode: { type: String },
  city: { type: String },
  email: { type: String },
  phone: { type: String },
  gender: { type: String },
  birthDate: { type: Date },
  team: { type: String },
});

var Member = mongoose.model('Member', memberSchema);

export class MembersService {

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

  get(id: string) {
    let promise = new Promise((resolve, reject) => {
      console.log('querying member from db');
      Member.findOne({ _id: id }, (err, members) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(members);
      });
    });

    return promise;
  }

  add(member: IMember) {
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

  update(id: string, member: IMember) {
    let promise = new Promise((resolve, reject) => {
      // validate name existing
      if (!member.name) {
        reject('Missing member name');
      }

      console.log('updating member in db', member);

      Member.findOneAndUpdate({ _id: id }, member, function (err) {
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