import { firestore } from 'firebase-admin';
import { NewsArticle } from './models/news-article';
import { ArticleWord } from './models/article-word';
import { torknize, extractNoun } from './kuromoji';

export const extractWords = async (
  newsArticle: NewsArticle,
): Promise<ArticleWord[]> => {
  console.log('extractWords detail.title' + newsArticle.title);

  return extractNoun(await torknize(newsArticle.text)).map(
    (nown) =>
      ({
        id: nown.surface_form,
        newsArticleId: newsArticle.id,
        url: null,
        isAssociated: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      } as ArticleWord),
  );
};
