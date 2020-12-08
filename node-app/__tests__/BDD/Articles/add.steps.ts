import { defineFeature, loadFeature } from 'jest-cucumber';
import axios, {AxiosResponse} from 'axios';
import * as mysql from 'mysql2/promise';
import {Client} from "@elastic/elasticsearch";
import setUp from "../../../server/setUp";
import tearDown from "../../../server/tearDown";


const feature = loadFeature('./features/Articles/Add.feature');

defineFeature(feature, test => {
  beforeEach(async () => {
    return await setUp();
  });

  afterEach(async () => {
    return await tearDown();
  });

  test('Missing Required SourceId', ({ given, when, then }) => {
    let res: AxiosResponse;
    let body: {};

    given('a log body has been created without sourceId', () => {
      body = {
        url: 'something.com'
      };
    });

    when('a POST request is sent', async () => {
      try {
        res = await axios.post('http://hal-log-node-web/article', body);
      } catch (error) {
        res = error.response;
      }
    });

    then('400 response is received', () => {
      expect(res.status).toBe(400);
    });

    then('message says missing sourceId', () => {
      expect(res.data.message).toBe('`SourceID` is required');
    });
  });

  test('Missing Required Url', ({ given, when, then }) => {
    let res: AxiosResponse;
    let body: {};

    given('a log body has been created without Url', () => {
      body = {
        sourceId: 1
      };
    });

    when('a POST request is sent', async () => {
      try {
        res = await axios.post('http://hal-log-node-web/article', body);
      } catch (error) {
        res = error.response;
      }
    });

    then('400 response is received', () => {
      expect(res.status).toBe(400);
    });

    then('message says missing url', () => {
      expect(res.data.message).toBe('`Url` is required');
    });
  });

  test('Missing Required Message', ({ given, when, then }) => {
    let res: AxiosResponse;
    let body: {};

    given('a log body has been created without message', () => {
      body = {
        sourceId: 1,
        url: 'something.com'
      };
    });

    when('a POST request is sent', async () => {
      try {
        res = await axios.post('http://hal-log-node-web/article', body);
      } catch (error) {
        res = error.response;
      }
    });

    then('400 response is received', () => {
      expect(res.status).toBe(400);
    });

    then('message says missing message', () => {
      expect(res.data.message).toBe('`Message` is required');
    });
  });

  test('Missing Required StatusId', ({ given, when, then }) => {
    let res: AxiosResponse;
    let body: {};

    given('a log body has been created without statusId', () => {
      body = {
        sourceId: 1,
        url: 'something.com',
        message: 'something happened'
      };
    });

    when('a POST request is sent', async () => {
      try {
        res = await axios.post('http://hal-log-node-web/article', body);
      } catch (error) {
        res = error.response;
      }
    });

    then('400 response is received', () => {
      expect(res.status).toBe(400);
    });

    then('message says missing statusId', () => {
      expect(res.data.message).toBe('`StatusID` is required');
    });
  });

  test('Missing Required Date', ({ given, when, then }) => {
    let res: AxiosResponse;
    let body: {};

    given('a log body has been created without date', () => {
      body = {
        sourceId: 1,
        url: 'something.com',
        message: 'something happened',
        statusId: 1
      };
    });

    when('a POST request is sent', async () => {
      try {
        res = await axios.post('http://hal-log-node-web/article', body);
      } catch (error) {
        res = error.response;
      }
    });

    then('400 response is received', () => {
      expect(res.status).toBe(400);
    });

    then('message says missing date', () => {
      expect(res.data.message).toBe('`Date` is required');
    });
  });

  test('Saved Article Log successfully', ({ given, when, then }) => {
    let res: AxiosResponse;
    let body: {};

    given('a log body has been created', () => {
      body = {
        sourceId: 1,
        url: 'something.com',
        message: 'something happened',
        statusId: 1,
        date: "2019-12-01 00:00:00"
      };
    });

    when('a POST request is sent', async () => {
      try {
        res = await axios.post('http://hal-log-node-web/article', body);
      } catch (error) {
        res = error.response;
      }
    });

    then('201 response is received', () => {
      expect(res.status).toBe(201);
    });

    then('a matching record appears in the MySQL db', async () => {
      const dbConnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_SCHEMA
      });

      let rows: any;
      [rows] = await dbConnection.execute('select * from `articles` where id = ?', [res.data.data.id]);
      await dbConnection.end();

      expect(rows.length).toBe(1);
      expect(rows[0].id).toBe(res.data.data.id);
    });

    then('a matching record appears in the Elasticsearch index', async () => {
      const elasticsearchConnection = new Client({ node: process.env.ELASTICSEARCH_HOST });
      const results = await elasticsearchConnection.get({
        index: 'articles',
        id: res.data.data.id
      });

      await elasticsearchConnection.close();

      expect(parseInt(results.body._id)).toBe(res.data.data.id);
    });
  });

});