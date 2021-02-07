import firebase from 'firebase/app';
import { collectionName } from 'services/wikipedia-news/constants';
import { ArticleWord } from 'services/wikipedia-news/models/article-word';

export const findByNewsArticleIdAndArticleWordId = async (
  newsArticleId: string,
  ArticleWordId: string,
): Promise<ArticleWord> => {
  const db = firebase.firestore();

  const snap = await db
    .collection(collectionName.newsArticles)
    .doc(newsArticleId)
    .collection(collectionName.articleWords)
    .doc(ArticleWordId)
    .get();

  const model = snap.data() as ArticleWord;
  if (model === undefined) throw new Error('data not found.');

  return model;
};

export const findById = async (id: string): Promise<ArticleWord[]> => {
  const db = firebase.firestore();

  const snap = await db
    .collectionGroup(collectionName.articleWords)
    .where('id', '==', id)
    .get();

  const articleWords: ArticleWord[] = [];
  snap.forEach((doc) => {
    articleWords.push(doc.data() as ArticleWord);
  });

  console.log('findbyid[');
  console.log(JSON.stringify(articleWords));
  console.log('findbyid]');

  return articleWords;
};

export const updateCollectionGroup = async (
  value: Partial<ArticleWord>,
): Promise<void> => {
  if (!value.id) throw new Error();
  const db = firebase.firestore();

  const snap = await db
    .collectionGroup(collectionName.articleWords)
    .where('id', '==', value.id)
    .get();

  snap.forEach((doc) => {
    doc.ref.update({ ...value });
  });
};
