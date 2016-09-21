import * as jwt from 'express-jwt';
import * as express from "express";    
import { EventRepository } from './events.repository'; 
import { RegistrationRepository } from './../registrations/registrations.repository';

export class EventRoutes {

    eventRepository: EventRepository;
    registrationRepository: RegistrationRepository;
    jwtCheck: jwt.RequestHandler;

    constructor(jwtCheck: jwt.RequestHandler) {
        this.eventRepository = new EventRepository();
        this.registrationRepository = new RegistrationRepository();
        this.jwtCheck = jwtCheck;
    }

    registerRoutes(app: express.Application) {
        // Get all events
        app.get('/events', (req, res) => {
            console.log('getting events from repository');
            this.eventRepository.getAll().then(events => {
                res.status(200).json(events);
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });

        // Add new event
        app.post('/events', this.jwtCheck, (req, res) => {
            console.log('adding event to repository');
            let event = req.body;
            console.log('event', event);
            this.eventRepository.add(event).then(event => {
                res.status(201).json(event);
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });

        // Update an event
        app.post('/events/:id', this.jwtCheck, (req, res) => {
            console.log('updating event in repository');
            let event = req.body;
            console.log('event', event);
            this.eventRepository.update(req.params.id, event).then(event => {
                res.status(201).json(event);
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });

        // Delete event
        app.delete('/events/:id', this.jwtCheck, (req, res) => {
            console.log('deleting event from repository', req.params.id);
            this.eventRepository.delete(req.params.id).then(() => {
                res.status(200).send();
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });

        // Get event registrations
        app.get('/events/:id/registrations', this.jwtCheck, (req, res) => {
            console.log('getting event registrations from repository');
            this.registrationRepository.getEventRegistrations(req.params.id).then(registrations => {
                res.status(200).json(registrations);
            }).catch(err => {
                console.error('ERROR', err);
                res.status(500).send(err.toString());
            });
        });
    }
}
