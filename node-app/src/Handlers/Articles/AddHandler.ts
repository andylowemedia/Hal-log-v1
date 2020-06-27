import express from "express";
import AddArticleService from "../../Services/Articles/AddArticleService";
import mysql from "mysql2/promise";

export default class AddHandler {
  public async handle(req: express.Request, res: express.Response) {

    const results = await (new AddArticleService(mysql)).add(req.body);

    res.json({
      "success": results.message !== 'error',
      "data": results
    });
  }
}