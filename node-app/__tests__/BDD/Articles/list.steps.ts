import { defineFeature, loadFeature } from 'jest-cucumber';
import axios, {AxiosResponse} from 'axios';
import setUp from "../../../server/setUp";
import tearDown from "../../../server/tearDown";

const feature = loadFeature('./features/Articles/List.feature');

defineFeature(feature, test => {

  beforeEach(async () => {
    return await setUp();
  });

  afterEach(async () => {
    return await tearDown();
  });

  test('List Logs', async ({ given, then }) => {
    let res: AxiosResponse;

    given('the list page is accessed', async () => {
      res = await axios.get('http://hal-log-node-web/article');
    });

    then(/^a (.*) response will be received$/, (arg0) => {
      expect(res.status).toBe(parseInt(arg0));
    });

    then(/^success is (.*)$/, (arg0) => {
      const boolean = arg0 === 'true';
      expect(res.data.success).toBe(boolean);
    });

    then(/^count returns (.*) records$/, (arg0) => {
      expect(res.data.results.length).toBe(parseInt(arg0));
      expect(res.data.message).toBe('Found ' + arg0 + ' record(s)');
      expect(res.data.count).toBe(parseInt(arg0));
    });

  });

  test('List Logs with a limit of 5', ({ given, then }) => {
    let res: AxiosResponse;

    given(/^the list page is accessed with limit of (.*)$/, async (arg0) => {
      res = await axios.get('http://hal-log-node-web/article?size=' + arg0);
    });

    then(/^a (.*) response will be received$/, (arg0) => {
      expect(res.status).toBe(parseInt(arg0));
    });

    then(/^success is (.*)$/, (arg0) => {
      const boolean = arg0 === 'true';
      expect(res.data.success).toBe(boolean);
    });

    then(/^count returns (.*) records$/, (arg0) => {
      expect(res.data.results.length).toBe(parseInt(arg0));
      expect(res.data.message).toBe('Found ' + arg0 + ' record(s)');
      expect(res.data.count).toBe(parseInt(arg0));
    });
  });
});
