import express from 'express';

export default class ErrorHandler {
  public handle(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    const error = err.message.split('|||');

    let json = { success: false, message: error[0] }

    if (process.env.NODE_ENV === "development") {
      let json = { success: false, message: error[0], stack: err.stack }
    }

    res.status(error[1]).json(json)
  }
}