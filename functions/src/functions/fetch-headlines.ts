import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import * as headlineArticleStore from '../firestore-admin/headline-article';
import * as publisherStore from '../firestore-admin/publisher';
import { fetchTopHeadLines } from '../services/rakuten-rapid-api/google-news-api';
import {
  toPublishers,
  toHeadlineArticles,
} from '../services/wikipedia-news/google-news';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    const headlines = await fetchTopHeadLines(
      functions.config().rakuten_rapid_api.api_key,
    );

    const publishers = toPublishers(headlines.articles);
    await publisherStore.bulkCreate(db, publishers);

    const articles = toHeadlineArticles(headlines.articles, db);
    await headlineArticleStore.bulkCreate(db, articles);

    res.send('ok');
  });
