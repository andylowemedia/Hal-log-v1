import LoadArticleService from "./LoadArticleService";
import {Client} from "@elastic/elasticsearch";

export default () => {
  return new LoadArticleService(
    new Client({node: process.env.ELASTICSEARCH_HOST, requestTimeout:50, maxRetries:1})
  );
}
