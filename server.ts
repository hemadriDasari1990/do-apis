import { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import config from "config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
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

  private configureRoutes(): void {
    router(this.app);
  }

  public getDbInstance() {
    return this.dbInstance;
  }

  private configureMiddleware(): void {
    /* Enable Cross Origin Resource Sharing to all origins by default */
    this.app.use(cors());

    /* Disable default cache */
    this.app.set("etag", false);

    // set the view engine to ejs
    this.app.set("view engine", "ejs");

    // set public path for static assets
    this.app.use("/static", express.static(path.join(__dirname, "public")));

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.set({
        "Cache-Control": "public, max-age=86400",
        Expires: new Date(Date.now() + 86400000).toUTCString(),
      });
      next();
    });

    /* Configure requests body parsing */
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(bodyParser.json({ limit: "50mb" }));

    /* Adds some security defaults */
    this.app.use(helmet());

    this.app.use(morgan(config.get("env")));
  }
}
