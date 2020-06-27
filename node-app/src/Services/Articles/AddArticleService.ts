const { Client } = require('@elastic/elasticsearch')


export default class AddArticleService {

  private dbConn: any
  private elasticsearch: any;

  constructor(mysql: any) {
    this.dbConn = mysql;
    this.elasticsearch = new Client({ node: process.env.ELASTICSEARCH_HOST })
  }

  public async add(requestData: { sourceId: number, url: string, message: string, statusId: number, date: string})  {

    const dbConnection = await this.dbConn.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_SCHEMA
    });


    let message: { message: string, error: any, data: {} } = {
      message: "",
      error: null,
      data: {}
    };

    try {
      await dbConnection.query('START TRANSACTION');

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

      this.saveElasticsearch(data);

      await dbConnection.query('COMMIT');
      message.message = "success";
      message.data = data

    } catch(e) {

      await dbConnection.query('ROLLBACK');
      message.message = "error";
    }

    return message;
    // // query database
    // return dbConnection.then((connection: any) => {
    //   return connection.query('START TRANSACTION')
    //     .then((row: any) => {
    //       dbConnection.query('INSERT INTO `articles` (`source_id`, `url`, `message`, `status_id`, `date`) VALUES(?,?,?,?,?)',
    //         [8, 'http://something.com', 'Something here', 1, '2010-01-01 00:00:00']);
    //       console.log('inserting');
    //     }).then(() => {
    //       return connection.query('COMMIT');
    //     }).catch((error: any) => {
    //       return connection.query('ROLLBACK');
    //     })
    // });
  }

  private saveElasticsearch(data: { id: number, sourceId: number, url: string, message: string, statusId: number, date: string}) {
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

    this.elasticsearch.index(params);
  }
}