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
  fetchArticleDetails,
} from './firestore-admin/article-detail';
import { savePublishers } from './firestore-admin/publisher';
import { saveArticleWords } from './firestore-admin/article-word';
import {
  saveWikipediaWords,
  updateWikipediaWord,
  fetchNotSearchedWord,
} from './firestore-admin/wikipedia-word';

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
import { extractWords } from './services/w-news/article';
import { WikipediaWord } from './services/w-news/models/wikipedia-word';
import { fetchContentByTitle } from './services/wikipedia-api/wikipedia-api';

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

export const fetchHeadLines = functions
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

export const getArticles = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const snap = await admin
      .firestore()
      .collection(collectionName.articles)
      .get();
    const data = snap.docs.map((doc) => doc.data());
    res.send({ data });
  });

export const crawlArticles = functions
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

    res.send('hoge');
  });

export const articleExtractWords = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    console.log('--- strat articleExtractWords');

    const db = admin.firestore();

    // 単語分割
    const emptyWordsArticleDetails = await fetchEmptyWordsArticleDetails(db);

    for await (const detail of emptyWordsArticleDetails) {
      console.log('--- --- detail.title: ' + detail.title);
      const words = await extractWords(detail);
      await saveWikipediaWords(
        db,
        words.map(
          (w) =>
            ({
              id: w.id,
              title: null,
              url: null,
              isSearched: false,
            } as WikipediaWord),
        ),
      );
      await saveArticleWords(db, detail, words);
      await saveArticleDetails(db, [
        {
          ...detail,
          wordExtracted: true,
        },
      ]);

      await sleep();
    }

    res.send('hoge');
    console.log('--- end articleExtractWords');
  });

export const crawlWikipediaPage = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    console.log('--- strat associateWords');

    const db = admin.firestore();

    // 処理対象となる単語の取得
    const notSearchedWords = await fetchNotSearchedWord(db);

    for await (const word of notSearchedWords) {
      console.log('--- --- word.id: ' + word.id);
      const wikipediaContent = await fetchContentByTitle(word.id);

      const updateWord: WikipediaWord =
        wikipediaContent.query === undefined ||
        wikipediaContent.query.pages === undefined ||
        wikipediaContent.query.pages[0] === undefined ||
        (wikipediaContent.query.pages[0].missing !== undefined &&
          wikipediaContent.query.pages[0].missing === true) ||
        (wikipediaContent.query.pages[0].extract !== undefined &&
          wikipediaContent.query.pages[0].extract === '')
          ? {
              ...word,
              isSearched: true,
            }
          : {
              ...word,
              title: wikipediaContent.query.pages[0].title,
              url: wikipediaContent.query.pages[0].fullurl,
              isSearched: true,
            };

      await updateWikipediaWord(db, updateWord);
      await sleep();
    }

    res.send('hoge');
    console.log('--- end associateWords');
  });

export const kuromoji = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();
    const id = '3dUDCuYnGnKkpg7h3f3D';

    // 単語分割
    const articleDetails = await fetchArticleDetails(db, id);
    console.log('fetchArticleDetails:' + articleDetails.length);

    for await (const detail of articleDetails) {
      const words = await extractWords(detail);
      await saveArticleWords(db, detail, words);
    }
    // 単語抽出済みに更新
    await saveArticleDetails(
      db,
      articleDetails.map((detail) => ({
        ...detail,
        wordExtracted: true,
      })),
    );

    console.log('start');
    console.log(new Date());
    await sleep(2000);

    console.log('end');
    console.log(new Date());

    res.send('fuga');
  });

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
