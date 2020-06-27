import express from 'express';

export default class TestMiddleware {
  public process(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log('Middleware has been triggered');
    next();
  }
}