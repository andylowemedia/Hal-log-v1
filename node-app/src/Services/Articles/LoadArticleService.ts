import mysql from "mysql2/promise";


export default class LoadArticleService {

  private dbConn: any

  constructor(mysql: any) {
    this.dbConn = mysql;
  }

  public async load() {
    const connection = await this.dbConn.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_SCHEMA
    });
    // query database
    const rows = await connection.execute('SELECT * FROM `articles`');
    return rows[0];
  }

}