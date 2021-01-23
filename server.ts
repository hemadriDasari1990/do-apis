import { Application } from 'express';
import bodyParser from 'body-parser';
import config from "config";
import cors from 'cors';
import express from 'express';
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from 'morgan';
import router from "./router";

export default class Server {
  private app: Application = express();

  public bootstrap(): Application {
    this.configureDatabase();
    this.configureMiddleware();
    this.configureRoutes();
    return this.app;
  }

  private configureDatabase(): void {
    mongoose.connect(config.get("database"), { useCreateIndex: true, useNewUrlParser: true });
  }

  private configureRoutes(): void {
    router(this.app);
  }

  private configureMiddleware(): void {
    /* Enable Cross Origin Resource Sharing to all origins by default */
    this.app.use(cors());

    /* Disable default cache */
    this.app.set("etag", false);

    /* Configure requests body parsing */
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(bodyParser.json({limit: '50mb'}));

    /* Adds some security defaults */
    this.app.use(helmet());

    this.app.use(morgan('dev'));
  }
}