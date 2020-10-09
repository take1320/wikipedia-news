import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import puppeteer from 'puppeteer';

import {
  saveArticles,
  fetchEmptyDetailArticles,
} from './firestore-admin/article';
import {
  saveArticleDetails,
  fetchEmptyWordsArticleDetails,
} from './firestore-admin/article-detail';
import { savePublishers } from './firestore-admin/publisher';
import { saveArticleWords } from './firestore-admin/article-word';

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
import { torknize, extractNoun } from './services/w-news/kuromoji';
import { extractWords } from './services/w-news/article';

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

    res.send('ok');
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
    console.log('crawlableArticles:' + crawlableArticles.length);

    // ニュース記事を取得する
    const articleDetails = [];
    for await (const crawlableArticle of crawlableArticles) {
      articleDetails.push(await crawlArticleDetail(page, db, crawlableArticle));
    }
    console.log('articleDetails:' + articleDetails.length);
    const articleDetailsCount = await saveArticleDetails(db, articleDetails);
    await addCounter(db, collectionName.articleDetails, articleDetailsCount);

    // hasDetailをtrueに更新する
    const hasDetailArticles = (
      await Promise.all(
        articleDetails.map((articleDetail) => articleDetail.article.get()),
      )
    ).map((article) => ({ ...(article.data() as Article), hasDetail: true }));

    await saveArticles(db, hasDetailArticles);

    // 単語分割
    const emptyWordsArticleDetails = await fetchEmptyWordsArticleDetails(db);
    for await (const detail of emptyWordsArticleDetails) {
      const words = await extractWords(detail);
      await saveArticleWords(db, detail, words);
    }

    // 単語を登録する
    // wikipedia単語に登録されているかチェックする
    // 未登録だったら登録する
    // 登録済みだったら・・？

    // wikipedia問い合わせ

    res.send('hoge');
  });

export const kuromoji = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const text =
      'テストテキスト。私はGitHubにとても感謝しています。と記入すると、GitHubという名詞が取得できる。';

    const nounWords = extractNoun(await torknize(text));

    res.send({ nounWords });
  });
