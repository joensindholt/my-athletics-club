import * as mongoose from 'mongoose';
import * as express from "express";
import * as jwt from 'express-jwt';
import { SysEventsService } from './../sysevents/sysevents.service';
import { IHealth } from './health';

export class HealthRoutes {

  sysEventsService: SysEventsService;
  jwtCheck: any;

  constructor(jwtCheck: jwt.RequestHandler) {
    this.sysEventsService = new SysEventsService();
    this.jwtCheck = jwtCheck;
  }

  registerRoutes(app: express.Application) {
    app.get('/health', (req, res) => {
      // Can we query the db? 
      this.sysEventsService.getAll().then(() => {
        res.status(200).json(<IHealth>{
          status: 'Everything is OK'
        });
      }).catch(err => {
        res.status(200).json(<IHealth>{
          status: 'Failure: Could not query database'  
        });
      });
    });
  }
}
