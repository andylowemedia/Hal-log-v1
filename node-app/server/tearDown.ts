import * as mysql from "mysql2/promise";
import { Client } from '@elastic/elasticsearch';

export default async () => {
  const dbConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD
  });

  await dbConnection.execute('DROP DATABASE IF EXISTS `hal-logs`;');
  await dbConnection.end();

  const elasticsearchConnection = new Client({ node: process.env.ELASTICSEARCH_HOST });
  await elasticsearchConnection.indices.delete({
    index: 'articles',
  });
  await elasticsearchConnection.close();
};

