import puppeteer from 'puppeteer';

import { HeadlineArticle } from '../services/wikipedia-news/models/headline-articles';
import { NewsArticle } from '../services/wikipedia-news/models/news-article';

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

export const crawlNewsArticle = async (
  headline: HeadlineArticle,
): Promise<NewsArticle> => {
  console.log('article:' + headline.title);

  if (!headline.publisher.selector) {
    throw new Error('selector is empty');
  }

  const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
  const page = await browser.newPage();
  let rawTexts: string[];
  let url: string;
  try {
    console.log('await page.goto');
    console.log('url:' + headline.url);

    // 本文のクローリング
    await page.goto(headline.url, { waitUntil: 'domcontentloaded' });

    console.log('await page.evaluate');
    rawTexts = await page.evaluate((selector) => {
      console.log('inner evaluate');
      const list = Array.from(document.querySelectorAll(selector));
      return list.map((data) => data.textContent as string);
    }, headline.publisher.selector);

    console.log('page.url');
    // URL（リダイレクト先）
    url = page.url();
  } catch (e) {
    console.log('catch error!');
    throw e;
  } finally {
    console.log('browser.close');
    await browser.close();
  }

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

  const newsArticle: NewsArticle = {
    id: headline.id,
    title: headline.title,
    text: cleanText(rawTexts.join('\n')),
    rawText: rawTexts.join('\n'),
    url: url,
    headlineArticle: headline,
    wordExtracted: false,
    wordAssociated: false,
    createdAt: null,
    updatedAt: null,
  };

  console.log('newsArticle.text:' + newsArticle.text);

  return newsArticle;
};

export const extractCrawlableHeadlines = (
  articles: HeadlineArticle[],
): HeadlineArticle[] =>
  articles.filter((article) => article.publisher.selector);
