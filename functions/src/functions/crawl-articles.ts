import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import * as headlineArticleStore from '../firestore-admin/headline-article';
import * as newsArticleStore from '../firestore-admin/news-article';
import {
  crawlNewsArticle,
  extractCrawlableArticles,
} from '../crawlers/article';

module.exports = functions
  .region(functions.config().locale.region)
  .runWith({
    timeoutSeconds: 300,
    memory: '2GB',
  })
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    // クローリング可能な記事の絞り込み
    const articles = await headlineArticleStore.findNoDetails(db);
    const crawlableArticles = extractCrawlableArticles(articles);
    console.log('crawlableArticles:' + crawlableArticles.length);

    // ニュース記事を取得する
    const newsArticles = [];
    for await (const crawlableArticle of crawlableArticles) {
      newsArticles.push(await crawlNewsArticle(db, crawlableArticle));
    }
    console.log('newsArticles:' + newsArticles.length);
    await newsArticleStore.bulkCreate(db, newsArticles);

    // hasDetailをtrueに更新する
    for await (const newsArticle of newsArticles) {
      await headlineArticleStore.updateHasDetail(
        db,
        newsArticle.headlineArticle.id,
        true,
      );
    }

    res.send('ok');
  });
