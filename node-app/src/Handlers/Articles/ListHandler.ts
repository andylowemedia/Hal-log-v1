import express from 'express';
import mysql from 'mysql2/promise';
import LoadArticleService from "../../Services/Articles/LoadArticleService";
import {Client} from '@elastic/elasticsearch';


export default class ListHandler {
  public async handle(req: express.Request, res: express.Response) {

    // const loadArticleService = new LoadArticleService(mysql);

    res.json({
      "success": true,
      "data": [] // await loadArticleService.load()
    });
  }
}