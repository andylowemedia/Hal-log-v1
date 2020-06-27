import express from 'express';
import ArticleListHandler from "../src/Handlers/Articles/ListHandler";
import ArticleAddHandler from "../src/Handlers/Articles/AddHandler";
import TestMiddleware from "../src/Middleware/TestMiddleware";
import HealthCheckHandler from "../src/Handlers/HealthCheckHandler";
import ArticleValidationMiddleware from "../src/Middleware/Articles/ValidationMiddleware"
import ArticleReportHandler from "../src/Handlers/Articles/ReportHandler"

const router = express.Router();

router.head('/health-check', (new HealthCheckHandler()).handle);
router.get('/article', (new ArticleListHandler()).handle);
router.post('/article', (new ArticleValidationMiddleware()).process, (new ArticleAddHandler()).handle);
router.get('/article/report', (new ArticleReportHandler()).handle);

export default router;