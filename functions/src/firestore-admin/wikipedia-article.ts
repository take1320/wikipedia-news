import admin from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { WikipediaArticle } from '../services/wikipedia-news/models/wikipedia-article';

export const builCreate = async (
  db: admin.firestore.Firestore,
  wikipediaArticles: WikipediaArticle[],
): Promise<void> => {
  console.log('saveWikipediaArticles words' + wikipediaArticles.length);

  const wikipediaArticlesRef = db.collection(collectionName.wikipediaArticles);

  const query = await wikipediaArticlesRef.get();
  const existingWords = query.docs.map((doc) => doc.data() as WikipediaArticle);

  for await (const wikipediaArticle of wikipediaArticles) {
    if (existingWords.some((w) => w.id === wikipediaArticle.id)) {
      continue;
    }

    await wikipediaArticlesRef.doc(wikipediaArticle.id).set({
      ...wikipediaArticle,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
};

export const update = async (
  db: admin.firestore.Firestore,
  updateValue: WikipediaArticle,
): Promise<void> => {
  const currentValue = await findById(db, updateValue.id);

  await db
    .collection(collectionName.wikipediaArticles)
    .doc(updateValue.id)
    .set({
      ...currentValue,
      ...updateValue,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};

export const findById = async (
  db: admin.firestore.Firestore,
  id: string,
): Promise<WikipediaArticle> => {
  const snap = await db
    .collection(collectionName.wikipediaArticles)
    .doc(id)
    .get();
  const result = snap.data() as WikipediaArticle;

  if (result === undefined) throw new Error('id not found.');

  return result;
};

export const findNotSearched = async (
  db: admin.firestore.Firestore,
): Promise<WikipediaArticle[]> => {
  console.log('--- *** start findNotSearchedWord');

  const snap = await db
    .collection(collectionName.wikipediaArticles)
    .where('isSearched', '==', false)
    .orderBy('createdAt', 'asc')
    .limit(20)
    .get();

  const wikipediaArticles: WikipediaArticle[] = [];
  snap.forEach((doc) => {
    wikipediaArticles.push(doc.data() as WikipediaArticle);
  });

  console.log('wikipediaArticles.length:' + wikipediaArticles.length);

  console.log('--- *** end findNotSearchedWord');
  return wikipediaArticles;
};
