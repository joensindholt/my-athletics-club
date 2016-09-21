import * as express from "express";    
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import * as jwt from 'express-jwt';
import * as cors from 'cors';
import { Routes } from './routes';
import { Auth0Configuration } from './auth0.config';

// Initialize mongoose
mongoose.connect('mongodb://localhost/myathleticsclub');

// Initialize express
let app: express.Application = express();

// Initialize Auth0
var configuration = new Auth0Configuration();
var jwtCheck = jwt({
    secret: new Buffer(configuration.secretKey, 'base64'),
    audience: configuration.audience
});

// Configure our app to use bodyParser(it let us get the json data from a POST)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow CORS
app.use(cors());

// Init routes
let routes = new Routes(jwtCheck);
routes.registerRoutes(app);

// Start listening
let port = process.env.PORT || 8889;
app.listen(port, () => {
    console.log('Server listening at: http://localhost:' + port);
});
