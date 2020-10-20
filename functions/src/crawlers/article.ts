import puppeteer from 'puppeteer';
import admin from 'firebase-admin';

import { Article } from '../services/wikipedia-news/models/article';
import { Publisher } from '../services/wikipedia-news/models/publisher';
import { ArticleDetail } from '../services/wikipedia-news/models/article-detail';
import {
  hasPublisherSelector,
  findArticleRef,
} from '../firestore-admin/article';

export const crawlArticleDetail = async (
  page: puppeteer.Page,
  db: admin.firestore.Firestore,
  article: Article,
): Promise<ArticleDetail> => {
  console.log('article:' + article.title);

  const publisher: Publisher = (
    await article.publisher.get()
  ).data() as Publisher;

  if (!publisher.selector) {
    throw new Error('selector is empty');
  }

  // 本文のクローリング
  await page.goto(article.url, { waitUntil: 'domcontentloaded' });

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

  const articleRef = findArticleRef(db, article.id);

  const articleDetail: ArticleDetail = {
    title: article.title,
    text: cleanText(rawTexts.join('\n')),
    rawText: rawTexts.join('\n'),
    url: url,
    article: articleRef,
    publisher: article.publisher,
    wordExtracted: false,
    wikipediaAssociated: false,
    createdAt: null,
    updatedAt: null,
  };

  return articleDetail;
};

export const extractCrawlableArticles = async (
  db: admin.firestore.Firestore,
  articles: Article[],
): Promise<Article[]> => {
  const crawlable: Article[] = [];

  for (const article of articles) {
    const hasSelector = await hasPublisherSelector(db, article);
    if (hasSelector) crawlable.push(article);
  }
  return crawlable;
};
