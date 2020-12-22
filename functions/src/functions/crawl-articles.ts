import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import * as headlineArticleStore from '../firestore-admin/headline-article';
import * as newsArticleStore from '../firestore-admin/news-article';
import {
  crawlNewsArticle,
  extractCrawlableHeadlines,
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
    const articles = await headlineArticleStore.findByHasDetail(db, false);
    const crawlableHeadlines = extractCrawlableHeadlines(articles);
    console.log('crawlableHeadlines:' + crawlableHeadlines.length);

    // ニュース記事を取得する
    const newsArticles = [];
    for await (const crawlableArticle of crawlableHeadlines) {
      newsArticles.push(await crawlNewsArticle(crawlableArticle));
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
