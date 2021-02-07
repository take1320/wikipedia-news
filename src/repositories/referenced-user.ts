import firebase from 'firebase/app';
import { collectionName } from 'services/wikipedia-news/constants';
import { ReferencedUser } from 'services/wikipedia-news/models/referenced-user';

export const createViaNewsArticle = async (
  newsArticleId: string,
  articleWordId: string,
  userId: string,
): Promise<void> => {
  const db = firebase.firestore();

  const doc = db
    .collection(collectionName.newsArticles)
    .doc(newsArticleId)
    .collection(collectionName.articleWords)
    .doc(articleWordId)
    .collection(collectionName.referencedUsers)
    .doc(userId);

  await doc.set({
    id: userId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  } as ReferencedUser);
};

export const createViaWikipediaArticle = async (
  WikipediaArticleId: string,
  userId: string,
): Promise<void> => {
  const db = firebase.firestore();
  const doc = db
    .collection(collectionName.wikipediaArticles)
    .doc(WikipediaArticleId)
    .collection(collectionName.referencedUsers)
    .doc(userId);

  await doc.set({
    id: userId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  } as ReferencedUser);
};
