import express from 'express';

export default class ErrorHandler {
  public handle(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    let json = { success: false, message: err.message }

    // if (process.env.NODE_ENV === "development") {
    //   json = { success: false, message: err.message, stack: err.stack }
    // }
    res.status(500);
    res.json(json);
  }
}