import * as referencedUserRepository from 'repositories/referenced-user';
import * as wikipediaArticleRepository from 'repositories/wikipedia-article';
import * as articleWordRepository from 'repositories/article-word';
import * as userService from 'services/wikipedia-news/users';
import { WikipediaArticle } from 'services/wikipedia-news/models/wikipedia-article';
import { ArticleWord } from 'services/wikipedia-news/models/article-word';

export const reference = async (
  wikipediaArticleId: string,
  userId: string,
): Promise<void> => {
  // wikipedia記事に対する参照ユーザの追加
  await referencedUserRepository.createViaWikipediaArticle(
    wikipediaArticleId,
    userId,
  );

  // 参照ユーザ数の集計(更新)
  await aggregateReferencedUser(wikipediaArticleId);

  // 同期
  await syncToArticleWord(wikipediaArticleId);

  // ユーザに対する参照wikipedia記事のの追加
  await userService.referenceWikipedia(userId, wikipediaArticleId);
};

/**
 * wikipedia記事の参照ユーザ数を更新
 * @param wikipediaArticleId
 */
const aggregateReferencedUser = async (
  wikipediaArticleId: string,
): Promise<void> => {
  const count = await referencedUserRepository.countByWikipediaArticleIdViaWikipediaArticle(
    wikipediaArticleId,
  );
  await wikipediaArticleRepository.update({
    id: wikipediaArticleId,
    referencedCount: count,
  });
};

/**
 * wikipediaArticleをArticleWordに同期する
 * @param wikipediaArticleId
 */
const syncToArticleWord = async (wikipediaArticleId: string): Promise<void> => {
  const wikipediaArticle: WikipediaArticle = await wikipediaArticleRepository.findById(
    wikipediaArticleId,
  );

  const articleWord: Partial<ArticleWord> = {
    id: wikipediaArticle.id,
    title: wikipediaArticle.title,
    url: wikipediaArticle.url,
    referencedCount: wikipediaArticle.referencedCount,
    length: wikipediaArticle.length,
    summary: wikipediaArticle.summary,
  };

  await articleWordRepository.updateCollectionGroup(articleWord);
};
