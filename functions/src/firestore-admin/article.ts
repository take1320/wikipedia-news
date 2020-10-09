import admin from 'firebase-admin';

import { collectionName } from '../services/w-news/constants';
import { Article } from '../services/w-news/models/article';
import { Publisher } from '../services/w-news/models/publisher';

export const saveArticles = async (
  db: admin.firestore.Firestore,
  articles: Article[],
): Promise<number> => {
  const articlesRef = db.collection(collectionName.articles);
  let count = 0;

  for await (const article of articles) {
    await articlesRef.doc(article.id).set({
      ...article,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    count += 1;
  }

  return count;
};

export const fetchEmptyDetailArticles = async (
  db: admin.firestore.Firestore,
): Promise<Article[]> => {
  const snap = await db
    .collection(collectionName.articles)
    .where('hasDetail', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(30)
    .get();

  const articles: Article[] = [];
  snap.forEach((doc) => {
    articles.push(doc.data() as Article);
  });

  console.log('articles.length:' + articles.length);

  return articles;
};

export const hasPublisherSelector = async (
  db: admin.firestore.Firestore,
  article: Article,
): Promise<boolean> => {
  const publisher: Publisher = (
    await article.publisher.get()
  ).data() as Publisher;

  const hasSelector = publisher.selector !== null && publisher.selector !== '';

  console.log(
    `article.title:${article.title}, publisher.name:${
      publisher.name
    },hasSelector:${hasSelector ? 'true' : 'false'}`,
  );

  return hasSelector;
};

export const findArticleRef = (
  db: admin.firestore.Firestore,
  id: string,
): admin.firestore.DocumentReference<Article> => {
  return db
    .collection(collectionName.articles)
    .doc(id) as admin.firestore.DocumentReference<Article>;
};
