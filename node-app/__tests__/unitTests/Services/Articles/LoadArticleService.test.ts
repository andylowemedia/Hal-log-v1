import mysql, {Connection, ConnectionOptions} from 'mysql2/promise';
jest.mock('mysql2/promise')
import sinon from 'sinon';
import LoadArticleService from "../../../../src/Services/Articles/LoadArticleService";

test('should fetch article logs', async () => {

  const mockConnectListener = jest.spyOn(mysql, 'createConnection');
  mockConnectListener.mockImplementation(function(config: ConnectionOptions) : any {
    return {
      execute: () => {
        return [
          [{
            "id": 1,
            "source_id": 8,
            "url": "https://something.com",
            "message": "Soemting happened",
            "status_id": 1,
            "date": "2010-01-01 00:00:00s"
          }]
        ]
      }
    }
  });

  const service = new LoadArticleService(mysql);
  const rows = await service.load();

  expect(rows).toMatchObject([{
    "id": 1,
    "source_id": 8,
    "url": "https://something.com",
    "message": "Soemting happened",
    "status_id": 1,
    "date": "2010-01-01 00:00:00s"
  }]);

});