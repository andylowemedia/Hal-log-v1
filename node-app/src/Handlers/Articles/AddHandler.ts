import express from "express";
import AddArticleServiceFactory from "../../Services/Articles/AddArticleServiceFactory";

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const addArticleService = AddArticleServiceFactory();
    const results = await addArticleService.add(req.body);

    if (results.hasOwnProperty('error') && results.error) {
      throw results.error;
    }

    res.statusCode = 201;
    res.json({
      "success": true,
      "message": "Record ID " + results.data.id + " successfully added",
      "data": results.data
    });
  } catch (error) {
    next(error);
  }
}