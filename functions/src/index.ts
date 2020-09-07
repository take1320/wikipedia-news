import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import puppeteer from 'puppeteer';
import {
  saveArticles,
  fetchEmptyDetailArticles,
} from './firestore-admin/article';
import { saveArticleDetails } from './firestore-admin/articleDetail';
import { savePublishers } from './firestore-admin/publisher';
import { addCounter } from './firestore-admin/record-counter';
import { collectionName } from './services/w-news/constants';
import { fetchTopHeadLines } from './services/rakuten-rapid-api/google-news-api';
import { Article } from './services/w-news/models/article';
import { Publisher } from './services/w-news/models/publisher';
import { toPublishers, toArticles } from './services/w-news/google-news';
import {
  crawlArticleDetail,
  extractCrawlableArticles,
} from './crawlers/article';

admin.initializeApp();

const PUPPETEER_OPTIONS = {
  args: [
    '--disable-gpu',
    '-–disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
    '--single-process',
  ],
  headless: true,
};

export const publishers = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    const headLines = await fetchTopHeadLines(
      functions.config().rakuten_rapid_api.api_key,
    );

    const publishers: Publisher[] = toPublishers(headLines.articles);
    const savePublishersCount = await savePublishers(db, publishers);
    await addCounter(db, collectionName.publishers, savePublishersCount);

    const articles: Article[] = toArticles(headLines.articles, db);
    const saveArticlesCount = await saveArticles(db, articles);
    await addCounter(db, collectionName.articles, saveArticlesCount);

    // 登録したheadlineからサブコレクションのクローリング
    // サブコレクションが存在しないarticleを抽出
    // articleのurlに対してリクエストする
    // リクエスト先から指定した要素の本文を取得する
    // 本文を取得するとき、取得先に応じたセレクタを用いて取得する
    // 本文を取得したら、新しくドキュメントを作成しarticlesと紐付ける

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

export const test = functions
  .region(functions.config().locale.region)
  .runWith({
    timeoutSeconds: 300,
    memory: '2GB',
  })
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    const articles = await fetchEmptyDetailArticles(db);

    const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
    const page = await browser.newPage();

    // クローリング可能な記事の絞り込み
    const crawlableArticles = await extractCrawlableArticles(db, articles);

    // ニュース記事を取得する
    const articleDetails = [];
    for await (const crawlableArticle of crawlableArticles) {
      articleDetails.push(await crawlArticleDetail(page, crawlableArticle));
    }
    const articleDetailsCount = await saveArticleDetails(db, articleDetails);
    await addCounter(db, collectionName.articleDetails, articleDetailsCount);

    // 単語分割

    // wikipedia問い合わせ

    res.send('hoge');
  });
