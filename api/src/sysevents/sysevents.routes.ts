import * as express from "express";
import * as jwt from 'express-jwt';
import { SysEventsRepository } from './sysevents.repository';

export class SysEventRoutes {

    syseventsRepository: SysEventsRepository;
    jwtCheck: any;

    constructor(jwtCheck: jwt.RequestHandler) {
        this.syseventsRepository = new SysEventsRepository();
        this.jwtCheck = jwtCheck;
    }

    registerRoutes(app: express.Application) {
        // Add new system event
        app.post('/sysevents', (req, res) => {
            console.log('adding sysevent to repository');
            let sysevent = req.body;
            console.log('sysevent', sysevent);
            this.syseventsRepository.add(sysevent).then(sysevent => {
                res.status(201).json(sysevent);
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });
    }
}
