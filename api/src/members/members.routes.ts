import * as express from "express";    
import * as jwt from 'express-jwt';
import { MembersRepository } from './members.repository';

export class MembersRoutes {

    membersRepository: MembersRepository;
    jwtCheck: jwt.RequestHandler;

    constructor(jwtCheck: jwt.RequestHandler) {
        this.membersRepository = new MembersRepository();
        this.jwtCheck = jwtCheck;
    }

    registerRoutes(app: express.Application) {
        // Get all members
        app.get('/members', (req, res) => {
            console.log('getting members from repository');
            this.membersRepository.getAll().then(members => {
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
            this.membersRepository.add(member).then(member => {
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
            this.membersRepository.update(req.params.id, member).then(member => {
                res.status(201).json(member);
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });

        // Delete member
        app.delete('/members/:id', this.jwtCheck, (req, res) => {
            console.log('deleting member from repository', req.params.id);
            this.membersRepository.delete(req.params.id).then(() => {
                res.status(200).send();
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });
    }
}