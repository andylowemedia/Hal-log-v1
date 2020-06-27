import express from "express";

export default class ValidationMiddleware {
  public process(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.body.hasOwnProperty('sourceId') || isNaN(req.body.sourceId)) {
      throw new Error('`SourceID` is required|||400');
      // return this.errorResponse(400, res);
    }

    if (!req.body.hasOwnProperty('url') || !req.body.url) {
      throw new Error();
    }

    if (!req.body.hasOwnProperty('message') || !req.body.message) {
      throw new Error();
    }

    if (!req.body.hasOwnProperty('statusId') || isNaN(req.body.statusId)) {
      throw new Error();
    }

    if (!req.body.hasOwnProperty('date') || !req.body.date) {
      throw new Error();
    }

    next();
  }
}