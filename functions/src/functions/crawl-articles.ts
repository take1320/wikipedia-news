import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import puppeteer from 'puppeteer';

import * as articleStore from '../firestore-admin/article';
import * as articleDetailStore from '../firestore-admin/article-detail';
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

    const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
    const page = await browser.newPage();

    // クローリング可能な記事の絞り込み
    const articles = await articleStore.findNoDetails(db);
    const crawlableArticles = await extractCrawlableArticles(db, articles);
    console.log('crawlableArticles:' + crawlableArticles.length);

    // ニュース記事を取得する
    const articleDetails = [];
    for await (const crawlableArticle of crawlableArticles) {
      articleDetails.push(await crawlArticleDetail(page, db, crawlableArticle));
    }
    console.log('articleDetails:' + articleDetails.length);
    await articleDetailStore.bulkCreate(db, articleDetails);

    // hasDetailをtrueに更新する
    const hasDetailArticles = (
      await Promise.all(
        articleDetails.map((articleDetail) => articleDetail.article.get()),
      )
    ).map((article) => ({ ...(article.data() as Article), hasDetail: true }));
    await articleStore.bulkCreate(db, hasDetailArticles);

    res.send('ok');
  });
