import AddArticleService from "./AddArticleService";
import {Client} from "@elastic/elasticsearch";
import mysql from "mysql2/promise";

export default () => {
  let elasticsearch;

  try {
    elasticsearch = new Client({node: process.env.ELASTICSEARCH_HOST});
  } catch (error) {
    return error;
  }

  return new AddArticleService(
    mysql,
    elasticsearch
  );
}