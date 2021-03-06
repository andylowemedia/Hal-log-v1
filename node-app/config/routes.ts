import express from 'express';
import ArticleListHandler from "../src/Handlers/Articles/ListHandler";
import ArticleAddHandler from "../src/Handlers/Articles/AddHandler";
import TestMiddleware from "../src/Middleware/TestMiddleware";
import HealthCheckHandler from "../src/Handlers/HealthCheckHandler";
import ArticleValidationMiddleware from "../src/Middleware/Articles/ValidationMiddleware";
import ArticleReportHandler from "../src/Handlers/Articles/ReportHandler";
import SiteAnalyticsAddHandler from "../src/Handlers/Site/Analytics/AddHandler"
import SiteAnalyticsUpdateHandler from "../src/Handlers/Site/Analytics/UpdateHandler"
import Container from "../src/Services/Container";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../openapi.json";


const router = express.Router();

    router.use('/api-docs', swaggerUi.serve);
    router.get('/api-docs', swaggerUi.setup(swaggerDocument));

    router.get('/health-check', (new HealthCheckHandler()).handle);
    router.get(
        '/article',
        ArticleListHandler
    );

    router.post(
        '/article',
        ArticleValidationMiddleware,
        ArticleAddHandler
    );
//
//     router.get('/article/report', (new ArticleReportHandler()).handle);

    router.post('/site/analytic', SiteAnalyticsAddHandler);
    router.patch('/site/analytic', SiteAnalyticsUpdateHandler);

export default router;