import express from "express";

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusCode = 400;
    return res.json({
      "success": false,
      "message": "JSON body is empty"
    });
  }

  if (!req.body.hasOwnProperty('sourceId') || isNaN(req.body.sourceId)) {
    res.statusCode = 400;
    return res.json({
      "success": false,
      "message": "`SourceID` is required"
    });
  }

  if (!req.body.hasOwnProperty('url') || !req.body.url) {
    res.statusCode = 400;
    return res.json({
      "success": false,
      "message": "`Url` is required"
    });
  }

  if (!req.body.hasOwnProperty('message') || !req.body.message) {
    res.statusCode = 400;
    return res.json({
      "success": false,
      "message": "`Message` is required"
    });
  }

  if (!req.body.hasOwnProperty('statusId') || isNaN(req.body.statusId)) {
    res.statusCode = 400;
    return res.json({
      "success": false,
      "message": "`StatusID` is required"
    });
  }

  if (!req.body.hasOwnProperty('date') || !req.body.date) {
    res.statusCode = 400;
    return res.json({
      "success": false,
      "message": "`Date` is required"
    });
  }
  next();
}