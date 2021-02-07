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
