import * as jwt from 'express-jwt';
import * as express from "express";
import { EventsService } from './events.service';
import { RegistrationsService } from './registrations.service';

interface Json2XlsResponse extends express.Response {
  xls: (filename: string, json: Array<{}>) => void;
}

export class EventsRoutes {

  eventsService: EventsService;
  registrationsService: RegistrationsService;
  jwtCheck: jwt.RequestHandler;

  constructor(jwtCheck: jwt.RequestHandler) {
    this.eventsService = new EventsService();
    this.registrationsService = new RegistrationsService();
    this.jwtCheck = jwtCheck;
  }

  registerRoutes(app: express.Application) {
    // Get all events
    app.get('/events', (req, res) => {
      console.log('getting events from repository');
      this.eventsService.getAll().then(events => {
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
      this.eventsService.add(event).then(event => {
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
      this.eventsService.update(req.params.id, event).then(event => {
        res.status(201).json(event);
      }).catch(err => {
        console.error('ERROR', err);
        res.status(500).send(err.toString());
      });
    });

    // Delete event
    app.delete('/events/:id', this.jwtCheck, (req, res) => {
      console.log('deleting event from repository', req.params.id);
      this.eventsService.delete(req.params.id).then(() => {
        res.status(200).send();
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
      this.registrationsService.add(registration, req.ip).then(registration => {
        res.status(201).json(registration);
      }).catch(err => {
        console.error('ERROR', err);
        res.status(500).send(err.toString());
      });
    });

    // Get event registrations (public)
    app.get('/events/:id/registrations', (req, res) => {
      console.log('getting event registrations from repository');
      this.registrationsService.getEventRegistrations(req.params.id).then(registrations => {
        res.status(200).json(registrations);
      }).catch(err => {
        console.error('ERROR', err);
        res.status(500).send(err.toString());
      });
    });

    // Get event registration excel sheet
    app.get('/events/:id/registrations.xlsx', (req: express.Request, res: Json2XlsResponse) => {
      console.log('getting event registrations as excel');
      this.registrationsService.getRegistrationsExcelJson(req.params.id).then(json => {
        res.xls('deltagere.xlsx', json);
      }).catch(err => {
        console.error('ERROR', err);
        res.status(500).send(err.toString());
      })
    });
  }
}
