import express from 'express';

export class App {
  public express;

  constructor() {
    this.express = express();
    this.loadRoutes();
  }

  private loadRoutes(): void {
    const router = express.Router();

    router.get('/', (req, res) => {
      res.json({ message: 'Hello World!' });
    });

    this.express.use('/', router);
  }
}