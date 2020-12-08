import mysql from "mysql2/promise";
import { Client } from '@elastic/elasticsearch';
import * as fs from 'fs';
import * as util from 'util';


const importer = async () => {
  const dbConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD
  });

  await dbConnection.execute('DROP DATABASE IF EXISTS `hal-logs`;');
  await dbConnection.execute('CREATE SCHEMA `hal-logs` DEFAULT CHARACTER SET utf8mb4;');
  await dbConnection.query('USE `hal-logs`');
  await dbConnection.execute('DROP TABLE IF EXISTS `articles`;');

  const readFile = util.promisify(fs.readFile);
  const articleTable = await readFile(process.cwd() + '/sql/HalLogArticleTable.sql', 'utf8');
  await dbConnection.query(articleTable);
  const articleTestData = await readFile(process.cwd() + '/sql/HalLogArticleTestData.sql', 'utf8');
  await dbConnection.query(articleTestData);



  let rows: any;
  [rows] = await dbConnection.query('SELECT * FROM articles');
  await dbConnection.end();

  const elasticsearchConnection = new Client({ node: process.env.ELASTICSEARCH_HOST });

  for (let i = 0; i < rows.length; i++) {
    const result = await saveElasticsearch(
      elasticsearchConnection,
      {
        id: rows[i].id,
        sourceId: rows[i].source_id,
        url: rows[i].url,
        message: rows[i].message,
        statusId: rows[i].status_id,
        date: rows[i].date
      }
    );
  }

  elasticsearchConnection.close();
  console.log('importer');

  process.exit(0);
}

const saveElasticsearch = async (connection: any, data: { id: number, sourceId: number, url: string, message: string, statusId: number, date: string}) => {
  let params = {
    index: 'articles',
    id: data.id,
    body: {
      sourceId: data.sourceId,
      url: data.url,
      message: data.message,
      status: data.statusId,
      date: (new Date(data.date)).toISOString()
    }
  }

  return await connection.index(params);
}

importer();
