import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import * as GoogleNewsApi from '../services/rakuten-rapid-api/google-news-api';
import { saveArticles } from '../firestore-admin/article';
import { savePublishers } from '../firestore-admin/publisher';
import { addCounter } from '../firestore-admin/record-counter';
import { collectionName } from '../services/wikipedia-news/constants';
import { Article } from '../services/wikipedia-news/models/article';
import { Publisher } from '../services/wikipedia-news/models/publisher';
import {
  toPublishers,
  toArticles,
} from '../services/wikipedia-news/google-news';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    const headLines = await GoogleNewsApi.fetchTopHeadLines(
      functions.config().rakuten_rapid_api.api_key,
    );

    const publishers: Publisher[] = toPublishers(headLines.articles);
    const savePublishersCount = await savePublishers(db, publishers);
    await addCounter(db, collectionName.publishers, savePublishersCount);

    const articles: Article[] = toArticles(headLines.articles, db);
    const saveArticlesCount = await saveArticles(db, articles);
    await addCounter(db, collectionName.articles, saveArticlesCount);

    res.send('ok');
  });
