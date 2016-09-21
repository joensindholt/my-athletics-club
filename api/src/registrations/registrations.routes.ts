import * as jwt from 'express-jwt';
import * as express from "express";    
import { RegistrationRepository } from './registrations.repository';

export class RegistrationRoutes {
    
    registrationRepository: RegistrationRepository;
    jwtCheck: any;
    
    constructor(jwtCheck: jwt.RequestHandler) {
        this.registrationRepository = new RegistrationRepository();
        this.jwtCheck = jwtCheck;
    }

    registerRoutes(app: express.Application) {
        // Get all registrations
        app.get('/registrations', this.jwtCheck, (req, res) => {
            console.log('getting registrations from repository');
            this.registrationRepository.getAll().then(registrations => {
                res.status(200).json(registrations);
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });

        // Add new registration
        app.post('/registrations', (req, res) => {
            console.log('adding registration to repository');
            let registration = req.body;
            console.log('registration', registration);
            this.registrationRepository.add(registration, req.ip).then(registration => {
                res.status(201).json(registration);
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });

        // // Update registration status (complete/incomplete)
        // app.put('/registrations/:registrationId/status', (req, res) => {
        //     console.log('updating registration status');
        //     let registrationId = req.params.registrationId;
        //     console.log('registrationId', registrationId);
        //     let status = req.body.value;
        //     console.log('status', status);
        //     this.registrationRepository.updateRegistrationStatus(req.userId, registrationId, status).then(() => {
        //         res.status(200).send();
        //     }).catch(err => {
        //         console.error('ERROR', err);
        //         res.status(500);
        //     });
        // });

        // // Delete registration
        // app.delete('/registrations/:registrationId', (req, res) => {
        //     console.log('deleting registration');
        //     let registrationId = req.params.registrationId;
        //     console.log('registrationId', registrationId);
        //     this.registrationRepository.deleteRegistration(req.userId, registrationId).then(() => {
        //         res.status(204).send();
        //     }).catch(err => {
        //         console.error('ERROR', err);
        //         res.status(500);
        //     });
        // });
    }
}
