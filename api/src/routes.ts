import * as express from "express";
import * as jwt from 'express-jwt';
import { EventRoutes } from './events/events.routes';
import { MembersRoutes } from './members/members.routes';
import { RegistrationRoutes } from './registrations/registrations.routes';
import { SysEventRoutes } from './sysevents/sysevents.routes';

export class Routes {

    jwtCheck: jwt.RequestHandler;

    constructor(jwtCheck: jwt.RequestHandler) {
        this.jwtCheck = jwtCheck;
    }

    registerRoutes(app: express.Application) {
        new EventRoutes(this.jwtCheck).registerRoutes(app);
        new MembersRoutes(this.jwtCheck).registerRoutes(app);
        new RegistrationRoutes(this.jwtCheck).registerRoutes(app);
        new SysEventRoutes(this.jwtCheck).registerRoutes(app);
        // Register more resource routes here when needed
    }
}

