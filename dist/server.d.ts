import { Application } from 'express';
export default class Server {
    private app;
    bootstrap(): Application;
    private configureDatabase;
    private configureRoutes;
    private configureMiddleware;
}
