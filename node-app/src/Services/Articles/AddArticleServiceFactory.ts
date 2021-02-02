import AddArticleService from "./AddArticleService";
import {Client} from "@elastic/elasticsearch";
import mysql from "mysql2/promise";

export default () => {
  let elasticsearch = new Client({node: process.env.ELASTICSEARCH_HOST});

  return new AddArticleService(
    mysql,
    elasticsearch
  );
}