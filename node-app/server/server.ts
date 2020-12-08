
import express from 'express';
import routes from "../config/routes";
import ErrorHandler from "../src/Handlers/Error/ErrorHandler";
import NotFoundHandler from "../src/Handlers/Error/NotFoundHandler";
import bodyParser from "body-parser";
import HealthCheckHandler from "../src/Handlers/HealthCheckHandler";

// Create a new express app instance
const app: express.Application = express();

app.use(bodyParser.json());

app.use('/', routes);

app.use((new NotFoundHandler()).handle);

app.use((new ErrorHandler()).handle);


app.listen(80, function () {
  console.log('App is listening on port 80!');
});