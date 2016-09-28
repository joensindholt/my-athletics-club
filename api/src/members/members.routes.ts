import * as express from "express";
import * as jwt from 'express-jwt';
import { MembersService } from './members.service';

export class MembersRoutes {

  membersService: MembersService;
  jwtCheck: jwt.RequestHandler;

  constructor(jwtCheck: jwt.RequestHandler) {
    this.membersService = new MembersService();
    this.jwtCheck = jwtCheck;
  }

  registerRoutes(app: express.Application) {
    // Get all members
    app.get('/members', (req, res) => {
      console.log('getting members from repository');
      this.membersService.getAll().then(members => {
        res.status(200).json(members);
      }).catch(err => {
        console.error('ERROR', err);
        res.status(500).send(err.toString());
      });
    });

    // Add new member
    app.post('/members', this.jwtCheck, (req, res) => {
      console.log('adding member to repository');
      let member = req.body;
      console.log('member', member);
      this.membersService.add(member).then(member => {
        res.status(201).json(member);
      }).catch(err => {
        console.error('ERROR', err);
        res.status(500).send(err.toString());
      });
    });

    // Update a member
    app.post('/members/:id', this.jwtCheck, (req, res) => {
      console.log('updating member in repository');
      let member = req.body;
      console.log('member', member);
      this.membersService.update(req.params.id, member).then(member => {
        res.status(201).json(member);
      }).catch(err => {
        console.error('ERROR', err);
        res.status(500).send(err.toString());
      });
    });

    // Delete member
    app.delete('/members/:id', this.jwtCheck, (req, res) => {
      console.log('deleting member from repository', req.params.id);
      this.membersService.delete(req.params.id).then(() => {
        res.status(200).send();
      }).catch(err => {
        console.error('ERROR', err);
        res.status(500).send(err.toString());
      });
    });
  }
}