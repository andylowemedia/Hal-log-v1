import {Client} from '@elastic/elasticsearch';
import Mock from '@elastic/elasticsearch-mock';
import * as mysql from 'mysql2/promise';
jest.mock('mysql2/promise');
import AddArticleService from "../../../../src/Services/Articles/AddArticleService";

test('should add article log', async () => {
  const mock = new Mock();
  const elasticsearchClient = new Client({
    node: 'http://localhost:9200',
    Connection: mock.getConnection()
  });

  const mockConnectListener = jest.spyOn(mysql, 'createConnection');
  mockConnectListener.mockImplementation(function(config: mysql.ConnectionOptions) : any {
    return {
      query: () => {
        return [
          { insertId: 1 }
        ]
      }
    }
  });

  mock.add({
    method: 'PUT',
    path: '/articles/_doc/1'
  }, () => { return ''});



  const service = new AddArticleService(mysql, elasticsearchClient);
  const results = await service.add({ sourceId: 1, url: "http://www.google.com", message: "success", statusId: 1, date: "2019-01-01 00:00:00"});

  expect(results.message).toMatch("success");
});


test('should error when adding article log to MySQL', async () => {
  const mock = new Mock();
  const elasticsearchClient = new Client({
    node: 'http://localhost:9200',
    Connection: mock.getConnection()
  });

  const mockConnectListener = jest.spyOn(mysql, 'createConnection');
  mockConnectListener.mockImplementation(function(config: mysql.ConnectionOptions) : any {
    return {
      query: (param: string) => {
        if (param !== 'ROLLBACK' && param !== 'START TRANSACTION') {
          throw new Error();
        }
      }
    }
  });

  const service = new AddArticleService(mysql, elasticsearchClient);
  const results = await service.add({ sourceId: 1, url: "http://www.google.com", message: "success", statusId: 1, date: "2019-01-01 00:00:00"});

  expect(results.message).toMatch("error");
  expect(results.data).toMatchObject({});
});

test('should error when adding article log to Elasticsearch', async () => {
  const mock = new Mock();
  const elasticsearchClient = new Client({
    node: 'http://localhost:9200',
    Connection: mock.getConnection()
  });

  const mockConnectListener = jest.spyOn(mysql, 'createConnection');
  mockConnectListener.mockImplementation(function(config: mysql.ConnectionOptions) : any {
    return {
      query: (param: string) => {
        return { insertId: 1 };
      }
    }
  });

  mock.add({
    method: 'PUT',
    path: '/articles/_doc/1'
  }, () => { throw new Error(); });


  const service = new AddArticleService(mysql, elasticsearchClient);
  const results = await service.add({ sourceId: 1, url: "http://www.google.com", message: "success", statusId: 1, date: "2019-01-01 00:00:00"});

  expect(results.message).toMatch("error");
  expect(results.data).toMatchObject({});
});