import {Client} from "@elastic/elasticsearch";

export default class LoadArticleService {

  private elasticsearchClient: Client;

  constructor(elasticsearchClient: Client) {
    this.elasticsearchClient = elasticsearchClient;
  }

  public async load(options: { size?: number } = {}) {
    const {body} = await this.elasticsearchClient.search({
      index: 'log-articles',
      size: options.hasOwnProperty('size') ? options.size : 50,
      body: {
        sort: { date : { order : "desc"}},
        query: {
          match_all: {}
        }
      }
    });
    const results:{id: number, sourceId: number, url: string, message: string, status: number, date: string}[] = [];
    body.hits.hits.forEach((row:{_id: string, _source: {sourceId: number, url: string, message: string, status: number, date: string}}) => {
      results.push({
        id: parseInt(row['_id']),
        sourceId: row['_source']['sourceId'],
        url: row['_source']['url'],
        message: row['_source']['message'],
        status: row['_source']['status'],
        date: row['_source']['date']
      });
    });
    return {
      total: body.hits.total.value,
      count: results.length,
      results: results
    };
  }

}