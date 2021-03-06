import { Client } from '@elastic/elasticsearch';

export default class AddArticleService {

  private dbConn: any
  private elasticsearch: any;

  constructor(mysql: any, elasticsearchClient: Client) {
    this.dbConn = mysql;
    this.elasticsearch = elasticsearchClient; //new Client({ node: process.env.ELASTICSEARCH_HOST })
  }

  public async add(requestData: { sourceId: number, url: string, message: string, statusId: number, date: string})  {

    let message: { message: string, error: any, data: any } = {
      message: "",
      error: null,
      data: {}
    };
    const dbConnection = await this.dbConn.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_SCHEMA
    });

    await dbConnection.query('START TRANSACTION');

    try {
      const sql = 'INSERT INTO `articles` (`source_id`, `url`, `message`, `status_id`, `date`) VALUES(?, ?, ?, ?, ?)';
      const results = await dbConnection.query(
        sql,
        [requestData.sourceId, requestData.url, requestData.message, requestData.statusId, requestData.date]
      );

      const data: { id: number, sourceId: number, url: string, message: string, statusId: number, date: string} = {
        id: results[0].insertId,
        sourceId: requestData.sourceId,
        url: requestData.url,
        message: requestData.message,
        statusId: requestData.statusId,
        date: requestData.date
      };

      await this.saveElasticsearch(data);

      await dbConnection.query('COMMIT');
      message.message = "success";
      message.data = data

    } catch(e) {
      await dbConnection.query('ROLLBACK');
      message.error = e;
      message.message = "error";
    }
    dbConnection.end();
    return message;
  }

  private async saveElasticsearch(data: { id: number, sourceId: number, url: string, message: string, statusId: number, date: string}) {
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

    await this.elasticsearch.index(params);
  }
}