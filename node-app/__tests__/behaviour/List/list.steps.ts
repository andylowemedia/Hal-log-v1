import { defineFeature, loadFeature } from 'jest-cucumber';
import axios, {AxiosResponse} from 'axios';
import http from 'http';
import {response} from "express";


const feature = loadFeature('./features/List.feature');

defineFeature(feature, test => {
  beforeAll(async () => {
    console.log('before');
  });

  afterAll(async () => {
    console.log('after');
  });

  test('List Logs',  ({ given, when, then }) => {
    let res: AxiosResponse;

    given('the list page is accessed', async () => {
      res = await axios.head('http://hal-log-node-web/article');
    });

    when('page has loaded', async () => {

    });

    then('a 200 response will be received', () => {
      expect(res.status).toBe(200);
    });
  });
});