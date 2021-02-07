import * as NewsArticleRepository from 'domains/models/news-articles/news-article-repository';
import { User } from 'domains/models/users/user';

/**
 * Wikipedia記事を参照する時は、参照履歴を保存する
 * @param newsArticleId
 * @param articleWordId
 * @param userId
 */
export const referenceByNews = async (
  newsArticleId: string,
  articleWordId: string,
  user: User,
): Promise<void> => {
  const newsArticle = await NewsArticleRepository.findById(newsArticleId);
  await newsArticle.referenceWord(articleWordId, user);
};
