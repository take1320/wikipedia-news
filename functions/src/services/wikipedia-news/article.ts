import { firestore } from 'firebase-admin';
import { ArticleDetail } from './models/article-detail';
import { ArticleWord } from './models/article-word';
import { torknize, extractNoun } from './kuromoji';

export const extractWords = async (
  articleDetail: ArticleDetail,
): Promise<ArticleWord[]> => {
  console.log('extractWords detail.title' + articleDetail.title);

  return extractNoun(await torknize(articleDetail.text)).map(
    (nown) =>
      ({
        id: nown.surface_form,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      } as ArticleWord),
  );
};
