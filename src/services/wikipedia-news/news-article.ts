import * as articleWordService from 'services/wikipedia-news/article-word';

// ニュース記事の単語をユーザが参照する
export const referenceArticleWord = async (
  newsArticleId: string,
  ArticleWordId: string,
  userId: string,
): Promise<void> => {
  await articleWordService.reference(newsArticleId, ArticleWordId, userId);
};
