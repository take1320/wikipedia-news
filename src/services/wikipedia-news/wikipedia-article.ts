import * as referencedUserRepository from 'repositories/referenced-user';
import * as userService from 'services/wikipedia-news/users';

export const reference = async (
  wikipediaArticleId: string,
  userId: string,
): Promise<void> => {
  await referencedUserRepository.createViaWikipediaArticle(
    wikipediaArticleId,
    userId,
  );
  await userService.referenceWikipedia(userId, wikipediaArticleId);
};
