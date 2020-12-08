import express from 'express';
import LoadArticleServiceFactory from "../../Services/Articles/LoadArticleServiceFactory";
import LoadArticleService from "../../Services/Articles/LoadArticleService";

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const loadArticleService = LoadArticleServiceFactory();

    const options = {
      size: req.query.hasOwnProperty('size') && typeof req.query.size === 'string' ? parseInt(req.query.size) : 50
    }

    const data = await loadArticleService.load(options);

    res.json({
      success: true,
      message: 'Found ' + data.count + ' record(s)',
      total: data.total,
      count: data.count,
      results: data.results
    });
  } catch (error) {
    return next(error);
  }
}
