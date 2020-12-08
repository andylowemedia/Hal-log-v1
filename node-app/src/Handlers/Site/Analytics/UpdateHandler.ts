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

  return res.json({
    request: {
      ip: ip,
      location: ipLookup.data,
      userAgent: req.headers['user-agent'],
      
    }
  });
};