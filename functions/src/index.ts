import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import { saveArticles } from './firestore-admin/article';
import { savePublishers, findPublisherRef } from './firestore-admin/publisher';
import { addCounter } from './firestore-admin/record-counter';
import { collectionName } from './services/w-news/constants';
import { fetchTopHeadLines } from './services/rakuten-rapid-api/google-news-api';
import { Article as GNArticle } from './services/rakuten-rapid-api/models/google-news';
import { Article } from './services/w-news/models/article';
import { Publisher } from './services/w-news/models/publisher';
import { toPublisher } from './services/w-news/google-news';

admin.initializeApp();

export const publishers = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();
    const headLines = await fetchTopHeadLines(
      functions.config().rakuten_rapid_api.api_key,
    );

    const publishers: Publisher[] = headLines.articles.map(
      (gNArticle: GNArticle): Publisher => toPublisher(gNArticle),
    );
    const savePublishersCount = await savePublishers(db, publishers);
    await addCounter(db, collectionName.publishers, savePublishersCount);

    const articles: Article[] = headLines.articles.map(
      (article: GNArticle): Article => {
        const publisherRef = findPublisherRef(db, article.source.title);
        if (!publisherRef) throw new Error('publisher not found');
        return {
          title: article.title,
          url: article.link,
          publisher: publisherRef,
          createdAt: null,
          updatedAt: null,
        };
      },
    );
    const saveArticlesCount = await saveArticles(db, articles);
    await addCounter(db, collectionName.articles, saveArticlesCount);

    res.send({ articles });
  });

export const articles = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const snap = await admin
      .firestore()
      .collection(collectionName.articles)
      .get();
    const data = snap.docs.map((doc) => doc.data());
    res.send({ data });
  });
