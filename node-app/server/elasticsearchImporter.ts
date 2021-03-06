import * as mysql from "mysql2/promise";
import { Client } from '@elastic/elasticsearch';
import DotEnv from 'dotenv';

DotEnv.config();
process.env.MYSQL_HOST="the-hal-project-db.ci8hu0holjv0.eu-west-1.rds.amazonaws.com"
process.env.MYSQL_USERNAME="haluser"
process.env.MYSQL_PASSWORD="Alyssaj0nes!"
process.env.MYSQL_SCHEMA="hal-logs"

process.env.ELASTICSEARCH_HOST="http://172.31.46.192:9200"


function sleep(milliseconds: number) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const importer = async () => {
  const dbConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_SCHEMA
  });
  const statuses = [ 4, 5, 6 ];

  for (let i: number = 0; i < statuses.length; i++) {
    console.log('SELECT count(*) as count FROM `articles` where status_id = ' + statuses[i]);
    let rows: any = await dbConnection.query('SELECT count(*) as count FROM `articles` where status_id = ' + statuses[i]);

    const count: number = parseInt(rows[0][0].count);
    console.log('Count found: ' + count);

    for (let n: number = 0; n < count; n += 1000) {
      let dataRows: any = await dbConnection.query('SELECT * FROM `articles` where status_id = ' + statuses[i] + ' limit 1000 offset ' + n);
      for (let a = 0; a < dataRows[0].length; a++) {
        await saveElasticsearch({
          id: parseInt(dataRows[0][a].id),
          sourceId: dataRows[0][a].source_id,
          url: dataRows[0][a].url,
          message: dataRows[0][a].message,
          statusId: dataRows[0][a].status_id,
          date: dataRows[0][a].date
        });
        console.log('saved record ID: ' + dataRows[0][a].id);
      }

    }
  }



  await dbConnection.end();
  process.exit(0);
}

const saveElasticsearch = async (data: { id: any, sourceId: string, url: string, message: string, statusId: number, date: string}) => {
  const elasticsearchConnection = await new Client({ node: process.env.ELASTICSEARCH_HOST });
  let params = {
    index: 'log-articles',
    id: data.id,
    body: {
      sourceId: data.sourceId,
      url: data.url,
      message: data.message,
      status: data.statusId,
      date: (new Date(data.date)).toISOString()
    }
  }

  await elasticsearchConnection.index(params);
  await elasticsearchConnection.close();

}

importer();