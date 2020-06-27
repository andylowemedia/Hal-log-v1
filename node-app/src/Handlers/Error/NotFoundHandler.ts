import express from 'express';

export default class NotFoundHandler {
  public handle(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(404).json({ "success" : false, "message" : "Sorry can't find that!" })
  }
}
