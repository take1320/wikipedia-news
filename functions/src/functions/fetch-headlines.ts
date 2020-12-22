import * as functions from 'firebase-functions';
import admin, { firestore } from 'firebase-admin';

import * as headlineArticleStore from '../firestore-admin/headline-article';
import * as publisherStore from '../firestore-admin/publisher';
import { Article as GNArticle } from '../services/rakuten-rapid-api/models/google-news';
import { fetchTopHeadLines } from '../services/rakuten-rapid-api/google-news-api';
import { HeadlineArticle } from '../services/wikipedia-news/models/headline-articles';
import { Publisher } from '../services/wikipedia-news/models/publisher';
import { findById } from '../firestore-admin/publisher';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    const headlines = await fetchTopHeadLines(
      functions.config().rakuten_rapid_api.api_key,
    );

    const publishers = toPublishers(headlines.articles);
    await publisherStore.bulkCreate(db, publishers);

    const articles = await toHeadlineArticles(headlines.articles, db);
    await headlineArticleStore.bulkCreate(db, articles);

    res.send('ok');
  });

const toHeadlineArticles = async (
  gNArticles: GNArticle[],
  db: firestore.Firestore,
): Promise<HeadlineArticle[]> => {
  const headlineArticles: HeadlineArticle[] = [];

  for (const gNArticle of gNArticles) {
    const publisher = await findById(db, gNArticle.source.title);

    headlineArticles.push({
      id: gNArticle.id,
      title: gNArticle.title,
      url: gNArticle.link,
      publisher: publisher,
      publishedAt: firestore.Timestamp.fromDate(new Date(gNArticle.published)),
      hasDetail: false,
      createdAt: null,
      updatedAt: null,
    });
  }

  return headlineArticles;
};

const toPublisher = (gNArticle: GNArticle): Publisher => ({
  name: gNArticle.source.title,
  url: gNArticle.source.href,
  selector: null,
  createdAt: null,
  updatedAt: null,
});

const toPublishers = (gNArticles: GNArticle[]): Publisher[] =>
  gNArticles.map((gNArticle: GNArticle): Publisher => toPublisher(gNArticle));
