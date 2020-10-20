import admin from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { WikipediaWord } from '../services/wikipedia-news/models/wikipedia-word';

export const saveWikipediaWords = async (
  db: admin.firestore.Firestore,
  wikipediaWords: WikipediaWord[],
): Promise<number> => {
  console.log('saveWikipediaWords words' + wikipediaWords.length);

  const wikipediaWordsRef = db.collection(collectionName.wikipediaWords);
  let count = 0;

  const query = await wikipediaWordsRef.get();
  const existingWords = query.docs.map((doc) => doc.data() as WikipediaWord);

  for await (const wikipediaWord of wikipediaWords) {
    if (existingWords.some((w) => w.id === wikipediaWord.id)) {
      continue;
    }

    await wikipediaWordsRef.doc(wikipediaWord.id).set({
      ...wikipediaWord,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    count += 1;
  }

  return count;
};

export const updateWikipediaWord = async (
  db: admin.firestore.Firestore,
  updateValue: WikipediaWord,
): Promise<void> => {
  const currentValue = await fetchById(db, updateValue.id);

  await db
    .collection(collectionName.wikipediaWords)
    .doc(updateValue.id)
    .set({
      ...currentValue,
      ...updateValue,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};

export const fetchById = async (
  db: admin.firestore.Firestore,
  id: string,
): Promise<WikipediaWord> => {
  const snap = await db.collection(collectionName.wikipediaWords).doc(id).get();
  const result = snap.data() as WikipediaWord;

  if (result === undefined) throw new Error('id not found.');

  return result;
};

export const fetchNotSearchedWord = async (
  db: admin.firestore.Firestore,
): Promise<WikipediaWord[]> => {
  console.log('--- *** start fetchNotSearchedWord');

  const snap = await db
    .collection(collectionName.wikipediaWords)
    .where('isSearched', '==', false)
    .orderBy('createdAt', 'asc')
    .limit(3)
    .get();

  const wikipediaWords: WikipediaWord[] = [];
  snap.forEach((doc) => {
    wikipediaWords.push(doc.data() as WikipediaWord);
  });

  console.log('wikipediaWords.length:' + wikipediaWords.length);

  console.log('--- *** end fetchNotSearchedWord');
  return wikipediaWords;
};
