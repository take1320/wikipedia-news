import admin from 'firebase-admin';

import { collectionName } from '../services/w-news/constants';
import { ArticleDetail } from '../services/w-news/models/article-detail';
import { ArticleWord } from '../services/w-news/models/article-word';

export const saveArticleWords = async (
  db: admin.firestore.Firestore,
  articleDetail: ArticleDetail,
  articleWords: ArticleWord[],
): Promise<number> => {
  if (!articleDetail.id) throw new Error('articleDetail.id is null');

  console.log('saveArticleWords detail' + articleDetail.title);
  console.log('saveArticleWords words' + articleWords.length);

  const articleWordsRef = db
    .collection(collectionName.articleDetails)
    .doc(articleDetail.id)
    .collection(collectionName.articleWords);
  let count = 0;

  for await (const articleWord of articleWords) {
    await articleWordsRef.doc(articleWord.id).set({
      ...articleWord,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    count += 1;
  }

  return count;
};
