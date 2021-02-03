import firebase from 'firebase/app';

import { collectionName } from './constants';
import { ReferencedWikipediaArticle } from './models/referenced-wikipedia-article';
import { ReferencedUser } from 'services/wikipedia-news/models/referenced-user';

export const findReferencedWikipediaArticles = async (
  db: firebase.firestore.Firestore,
  id: string,
): Promise<ReferencedWikipediaArticle[]> => {
  const snap = await db
    .collection(collectionName.users)
    .doc(id)
    .collection(collectionName.referencedWikipediaArticles)
    .get();

  const referencedList: ReferencedWikipediaArticle[] = [];
  snap.forEach((doc) => {
    referencedList.push(doc.data() as ReferencedWikipediaArticle);
  });

  return referencedList;
};

export const updateReferencedWikipediaArticle = async (
  db: firebase.firestore.Firestore,
  userId: string,
  newsArticleId: string,
  wordTitle: string,
): Promise<void> => {
  // ユーザの参照ワードに追加する
  // const referencedWikipediaArticleDoc = db
  //   .collection(collectionName.users)
  //   .doc(userId)
  //   .collection(collectionName.referencedWikipediaArticles)
  //   .doc(wordTitle);

  // 記事の参照ユーザに追加する
  const referencedUsersDoc = db
    .collection(collectionName.newsArticles)
    .doc(newsArticleId)
    .collection(collectionName.articleWords)
    .doc(wordTitle)
    .collection(collectionName.referencedUsers)
    .doc(userId);

  await referencedUsersDoc.set({
    id: userId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  } as ReferencedUser);
};
