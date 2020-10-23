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
