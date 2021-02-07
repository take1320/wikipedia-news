import firebase from 'firebase/app';
import { collectionName } from 'services/wikipedia-news/constants';
import { ArticleWord as RawArticleWord } from 'services/wikipedia-news/models/article-word';
import { ArticleWord } from 'domains/models/article-words/article-word';

const toEntity = (rawData: RawArticleWord): ArticleWord => {
  return new ArticleWord({
    ...rawData,
    updatedAt: rawData.updatedAt?.toDate() ?? null,
    createdAt: rawData.createdAt?.toDate() ?? null,
  });
};

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

  const rawData = snap.data() as RawArticleWord;
  if (rawData === undefined) throw new Error('data not found.');

  return toEntity(rawData);
};
