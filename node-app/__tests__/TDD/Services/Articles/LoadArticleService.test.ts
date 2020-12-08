import {Client} from '@elastic/elasticsearch';
import Mock from '@elastic/elasticsearch-mock';
import LoadArticleService from "../../../../src/Services/Articles/LoadArticleService";

test('should fetch article logs', async () => {

  const mock = new Mock();
  const elasticsearchClient = new Client({
    node: 'http://localhost:9200',
    Connection: mock.getConnection()
  });

  mock.add({
    method: 'POST',
    path: '/articles/_search'
  }, () => {
    return {
      hits: {
        total: { value: 1, relation: 'eq' },
        hits: [{
          "_index" : "articles",
          "_type" : "_doc",
          "_id" : "1",
          "_score" : null,
          "_source" : {
            "sourceId" : 1,
            "url" : "https://something.com",
            "message" : "something happened",
            "status" : 4,
            "date" : "2020-09-01T00:00:00.000Z"
          },
          "sort" : [
            1598918400000
          ]
        }]
      }
    }
  })

  const service = new LoadArticleService(elasticsearchClient);
  const rows = await service.load();

  expect(rows).toMatchObject({
    "count": 1,
    "total": 1,
    "results": [{
      "id": 1,
      "sourceId": 1,
      "url": "https://something.com",
      "message": "something happened",
      "status": 4,
      "date": "2020-09-01T00:00:00.000Z"
    }]
  });
});

test('should fetch article logs limited to 1', async () => {
  const mock = new Mock();
  const elasticsearchClient = new Client({
    node: 'http://123566:9200',
    Connection: mock.getConnection()
  });

  mock.add({
    method: 'POST',
    path: '/articles/_search'
  }, () => {
    return {
      hits: {
        total: { value: 1, relation: 'eq' },
        hits: [{
          "_index" : "articles",
          "_type" : "_doc",
          "_id" : "1",
          "_score" : null,
          "_source" : {
            "sourceId" : 1,
            "url" : "https://something.com",
            "message" : "something happened",
            "status" : 4,
            "date" : "2020-09-01T00:00:00.000Z"
          },
          "sort" : [
            1598918400000
          ]
        }]
      }
    }
  })

  const service = new LoadArticleService(elasticsearchClient);
  const rows = await service.load({ size: 1 });

  expect(rows).toMatchObject({
    "count": 1,
    "total": 1,
    "results": [{
      "id": 1,
      "sourceId": 1,
      "url": "https://something.com",
      "message": "something happened",
      "status": 4,
      "date": "2020-09-01T00:00:00.000Z"
    }]
  });

});