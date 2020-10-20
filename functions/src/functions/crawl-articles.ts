import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import puppeteer from 'puppeteer';

import {
  saveArticles,
  fetchEmptyDetailArticles,
} from '../firestore-admin/article';
import { saveArticleDetails } from '../firestore-admin/article-detail';

import { addCounter } from '../firestore-admin/record-counter';
import { collectionName } from '../services/wikipedia-news/constants';
import { Article } from '../services/wikipedia-news/models/article';
import {
  crawlArticleDetail,
  extractCrawlableArticles,
} from '../crawlers/article';

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

module.exports = functions
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

    res.send('ok');
  });
