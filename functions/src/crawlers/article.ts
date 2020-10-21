import puppeteer from 'puppeteer';
import admin from 'firebase-admin';

import * as headlineArticleStore from '../firestore-admin/headline-article';
import { HeadlineArticle } from '../services/wikipedia-news/models/headline-articles';
import { Publisher } from '../services/wikipedia-news/models/publisher';
import { ArticleDetail } from '../services/wikipedia-news/models/article-detail';

export const crawlArticleDetail = async (
  page: puppeteer.Page,
  db: admin.firestore.Firestore,
  headline: HeadlineArticle,
): Promise<ArticleDetail> => {
  console.log('article:' + headline.title);

  const publisher: Publisher = (
    await headline.publisher.get()
  ).data() as Publisher;

  if (!publisher.selector) {
    throw new Error('selector is empty');
  }

  // 本文のクローリング
  await page.goto(headline.url, { waitUntil: 'domcontentloaded' });

  const rawTexts = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    return list.map((data) => data.textContent);
  }, publisher.selector);

  // URL（リダイレクト先）
  const url = page.url();

  // 本文の加工
  const cleanText = (text: string | null): string => {
    // 取得不可の場合
    if (!text) return '';

    // 半角文字の行（アルファベット・記号のみ）を削除
    const removeHalfCharLine = text.replace(
      /(?<=(^|\n))[a-zA-Z0-9!-/:-@¥[-`{-~ ]+(?=($|\n))/g,
      '',
    );

    // 先頭の改行削除
    const removeFirstLineReturn = removeHalfCharLine.replace(/^\n+/g, '');

    // ２重改行の削除
    const removeDoubleReturn = removeFirstLineReturn.replace(/(\n)+/g, '\n');

    return removeDoubleReturn;
  };

  const articleRef = headlineArticleStore.getRefById(db, headline.id);

  const articleDetail: ArticleDetail = {
    title: headline.title,
    text: cleanText(rawTexts.join('\n')),
    rawText: rawTexts.join('\n'),
    url: url,
    article: articleRef,
    publisher: headline.publisher,
    wordExtracted: false,
    wikipediaAssociated: false,
    createdAt: null,
    updatedAt: null,
  };

  return articleDetail;
};

export const extractCrawlableArticles = async (
  db: admin.firestore.Firestore,
  articles: HeadlineArticle[],
): Promise<HeadlineArticle[]> => {
  const crawlableArtiles: HeadlineArticle[] = [];

  for (const article of articles) {
    const hasSelector = await headlineArticleStore.hasPublisherSelector(
      article,
    );
    if (hasSelector) crawlableArtiles.push(article);
  }
  return crawlableArtiles;
};
