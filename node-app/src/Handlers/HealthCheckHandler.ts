import express from 'express';

export default class HealthCheckHandler {
  public handle(req: express.Request, res: express.Response) {
    res.json({
      "success": true,
      "messgae": "Log Microservice Health check"
    });
  }
}