import { NextFunction, Request, Response } from "express";

import { Application } from "express";
import bodyParser from "body-parser";
import config from "config";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
// import path from "path";
import router from "./router";

export default class Server {
  private app: Application = express();
  private dbInstance: any;
  public bootstrap(): Application {
    this.configureDatabase(); /* Connect to the Database */
    this.configureMiddleware(); /* Configuration set up*/
    this.configureRoutes(); /* Configure routes */
    return this.app;
  }

  private async configureDatabase(): Promise<void> {
    const connectionInstance: any = await mongoose.connect(
      config.get("database"),
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        connectWithNoPrimary: true,
        useUnifiedTopology: true, // To use the new Server Discover and Monitoring engine
      }
    );
    this.dbInstance = connectionInstance;
  }

  private allowCrossDomain(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  }

  private configureRoutes(): void {
    router(this.app);
  }

  public getDbInstance() {
    return this.dbInstance;
  }

  private configureMiddleware(): void {
    /* Enable Cross Origin Resource Sharing to all origins by default */
    this.app.use(this.allowCrossDomain);
    /* Disable default cache */
    // this.app.set("etag", false);

    // set the view engine to ejs
    this.app.set("view engine", "ejs");

    // set public path for static assets
    // this.app.use("/static", express.static(path.join(__dirname, "public")));

    this.app.use(
      "/static",
      express.static("public", {
        etag: true, // Just being explicit about the default.
        lastModified: true, // Just being explicit about the default.
        setHeaders: (res, path) => {
          const hashRegExp = new RegExp("\\.[0-9a-f]{8}\\.");

          if (path.endsWith(".html")) {
            // All of the project's HTML files end in .html
            res.setHeader("Cache-Control", "no-cache");
          } else if (hashRegExp.test(path)) {
            // If the RegExp matched, then we have a versioned URL.
            res.setHeader("Cache-Control", "max-age=31536000");
          }
        },
      })
    );

    /* Configure requests body parsing */
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(bodyParser.json({ limit: "50mb" }));

    /* Adds some security defaults */
    this.app.use(helmet());

    this.app.use(morgan(config.get("env")));
  }
}
