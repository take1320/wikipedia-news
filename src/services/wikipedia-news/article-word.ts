import * as referencedUserRepository from 'repositories/referenced-user';
import * as wikipediaArticleService from 'services/wikipedia-news/wikipedia-article';

export const reference = async (
  newsArticleId: string,
  articleWordId: string,
  userId: string,
): Promise<void> => {
  await wikipediaArticleService.reference(articleWordId, userId);
  await referencedUserRepository.createViaNewsArticle(
    newsArticleId,
    articleWordId,
    userId,
  );
};
