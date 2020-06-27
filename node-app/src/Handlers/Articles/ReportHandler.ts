import express from "express";
const { Client } = require('@elastic/elasticsearch')

export default class ReportHandler {
  public async handle(req: express.Request, res: express.Response) {
    const query = {
      index: "articles",
      body: {
        size: 0,
        query: {
          bool: {
            filter: [
              {
                range: {
                  date: {
                    gte: "now-30d/d",
                    lte: "now+1d/d"
                  }
                }
              }
            ]
          }
        },
        aggs: {
          status: {
            terms: {
              field: "statusId",
              order: {
                _key: "asc"
              }
            },
            aggs: {
              the_last_month: {
                date_histogram: {
                  field: "date",
                  format: "yyyy-MM-dd",
                  calendar_interval: "1d"
                }
              }
            }
          },
          articles: {
            terms: {
              field: "sourceId",
              size: 10000,
              order: {
                _key: "asc"
              }
            },
            aggs: {
              status: {
                terms: {
                  field: "statusId",
                  size: 10000,
                  order: {
                    _key: "asc"
                  }
                },
                aggs: {
                  per_day: {
                    date_histogram: {
                      field: "date",
                      format: "yyyy-MM-dd",
                      calendar_interval: "1d"
                    }
                  }
                }
              }
            }
          },
          overall: {
            terms: {
              field: "statusId",
              order: {
                _key: "asc"
              }
            },
            aggs: {
              per_day: {
                date_histogram: {
                  field: "date",
                  format: "yyyy-MM-dd",
                  calendar_interval: "1d"
                }
              }
            }
          }
        }
      }
    };

    const client = new Client({ node: 'http://hal-log-elasticsearch:9200' });
    const results = await client.search(query);

    res.json({
      "success": true,
      "data": results
    });

  }

}
