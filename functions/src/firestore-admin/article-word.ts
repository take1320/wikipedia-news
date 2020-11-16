import admin from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { NewsArticle } from '../services/wikipedia-news/models/news-article';
import { ArticleWord } from '../services/wikipedia-news/models/article-word';

export const bulkCreate = async (
  db: admin.firestore.Firestore,
  newsArticle: NewsArticle,
  articleWords: ArticleWord[],
): Promise<void> => {
  if (!newsArticle.id) throw new Error('newsArticle.id is null');

  console.log('saveArticleWords detail' + newsArticle.title);
  console.log('saveArticleWords words' + articleWords.length);

  const articleWordsRef = db
    .collection(collectionName.newsArticles)
    .doc(newsArticle.id)
    .collection(collectionName.articleWords);

  for await (const articleWord of articleWords) {
    await articleWordsRef.doc(articleWord.id).set({
      ...articleWord,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
};

export const findByNewsArticleId = async (
  db: admin.firestore.Firestore,
  newsArticleId: string,
): Promise<ArticleWord[]> => {
  const snap = await db
    .collection(collectionName.newsArticles)
    .doc(newsArticleId)
    .collection(collectionName.articleWords)
    .where('isAssociated', '==', false)
    .orderBy('createdAt', 'asc')
    .limit(10)
    .get();

  const articleWords: ArticleWord[] = [];
  snap.forEach((doc) => {
    articleWords.push(doc.data() as ArticleWord);
  });

  return articleWords;
};

export const findByNewsArticleIdAndId = async (
  db: admin.firestore.Firestore,
  newsArticleId: string,
  id: string,
): Promise<ArticleWord> => {
  const snap = await db
    .collection(collectionName.newsArticles)
    .doc(newsArticleId)
    .collection(collectionName.articleWords)
    .doc(id)
    .get();

  const result = snap.data() as ArticleWord;

  if (result === undefined) throw new Error('id not found.');

  return result;
};

export const update = async (
  db: admin.firestore.Firestore,
  value: ArticleWord,
): Promise<void> => {
  const currentValue = await findByNewsArticleIdAndId(
    db,
    value.newsArticleId,
    value.id,
  );

  await db
    .collection(collectionName.newsArticles)
    .doc(value.newsArticleId)
    .collection(collectionName.articleWords)
    .doc(value.id)
    .set({
      ...currentValue,
      ...value,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};
