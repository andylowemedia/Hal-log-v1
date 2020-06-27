
import express from 'express';
import Routes from "../config/routes";
import ErrorHandler from "../src/Handlers/Error/ErrorHandler";
import NotFoundHandler from "../src/Handlers/Error/NotFoundHandler";
import cors from 'cors';
import bodyParser from "body-parser";

// Create a new express app instance
const app: express.Application = express();

app.use(bodyParser.json());
if (process.env.NODE_ENV === 'development') {
  app.use(cors())
}

app.use('/', Routes);

app.use((new NotFoundHandler()).handle);

app.use((new ErrorHandler()).handle);


app.listen(80, function () {
  console.log('App is listening on port 80!');
});