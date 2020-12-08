import express from "express";
import axios from "axios";

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

  let ip = req.ip.replace('::ffff:', '');

  let ipLookup: any;

  try {
    ipLookup = await axios.get('https://ipapi.co/' + ip + '/json/');
  } catch (error) {
    ipLookup = error;
  }

  res.status(201);
  res.setHeader('Content-type', 'text/plain');
  // return res.json({
  //   request: {
  //     ip: ip,
  //     location: ipLookup.data,
  //     userAgent: req.headers['user-agent'],
  //     trackingId: Math.round(Math.random() * (9999999 - 1000000) + 1000000)
  //   }
  // });
  return res.send(Math.round(Math.random() * (9999999 - 1000000) + 1000000).toString());

};