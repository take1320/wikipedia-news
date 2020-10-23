import { WikipediaContent } from './models/wikipedia-content';
import { WikipediaArticle } from '../wikipedia-news/models/wikipedia-article';

export const mergeWikipediaArticle = (
  word: WikipediaArticle,
  content: WikipediaContent,
): WikipediaArticle => {
  if (
    content.query === undefined ||
    content.query.pages === undefined ||
    content.query.pages[0] === undefined ||
    content.query.pages[0].missing === true
  ) {
    return {
      ...word,
      isSearched: true,
    };
  }

  return {
    ...word,
    title: content.query.pages[0].title,
    url: content.query.pages[0].fullurl,
    isSearched: true,
  };
};
