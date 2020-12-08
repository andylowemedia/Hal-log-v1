import { defineFeature, loadFeature } from 'jest-cucumber';
import axios, {AxiosResponse} from 'axios';
import {response} from "express";


const feature = loadFeature('./features/HealthCheck.feature');
// beforeAll(async () => {
//   console.log('before');
// });
//
// afterAll(async () => {
//   console.log('after');
// });

describe("Test suite", () => {
  defineFeature(feature, test => {


    test('Loading Health Check',  ({ given, when, then }) => {
      let res: AxiosResponse;

      given('the health check page is accessed', async () => {
        res = await axios.get('http://hal-log-node-app/health-check');
      });

      then('a 200 health check response will be recieved', () => {
        expect(res.status).toBe(200);
      });
    });
  });
});