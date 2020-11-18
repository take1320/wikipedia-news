import { NewsArticle } from './news-article';
import { ArticleWord } from './article-word';

export type Article = {
  newsArticle: NewsArticle;
  articleWords: ArticleWord[];
};
