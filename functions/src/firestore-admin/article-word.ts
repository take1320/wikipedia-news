import admin from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { ArticleDetail } from '../services/wikipedia-news/models/article-detail';
import { ArticleWord } from '../services/wikipedia-news/models/article-word';

export const bulkCreate = async (
  db: admin.firestore.Firestore,
  articleDetail: ArticleDetail,
  articleWords: ArticleWord[],
): Promise<void> => {
  if (!articleDetail.id) throw new Error('articleDetail.id is null');

  console.log('saveArticleWords detail' + articleDetail.title);
  console.log('saveArticleWords words' + articleWords.length);

  const articleWordsRef = db
    .collection(collectionName.articleDetails)
    .doc(articleDetail.id)
    .collection(collectionName.articleWords);

  for await (const articleWord of articleWords) {
    await articleWordsRef.doc(articleWord.id).set({
      ...articleWord,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
};
