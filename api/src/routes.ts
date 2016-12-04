import * as express from "express";
import * as jwt from 'express-jwt';
import { EventsRoutes } from './events/events.routes';
import { MembersRoutes } from './members/members.routes';
import { SysEventsRoutes } from './sysevents/sysevents.routes';
import { HealthRoutes } from './health/health.routes';

export class Routes {

  jwtCheck: jwt.RequestHandler;

  constructor(jwtCheck: jwt.RequestHandler) {
    this.jwtCheck = jwtCheck;
  }

  registerRoutes(app: express.Application) {
    new EventsRoutes(this.jwtCheck).registerRoutes(app);
    new MembersRoutes(this.jwtCheck).registerRoutes(app);
    new SysEventsRoutes(this.jwtCheck).registerRoutes(app);
    new HealthRoutes(this.jwtCheck).registerRoutes(app);
    // Register more resource routes here when needed
  }
}

