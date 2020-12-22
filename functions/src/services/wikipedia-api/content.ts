import { WikipediaContent } from './models/wikipedia-content';

interface OrganizedContent {
  isMissing: boolean;
  title: string;
  fullUrl: string;
  extract: string;
  length: number;
}

export const organizeContent = (
  wikipediaContent: WikipediaContent,
): OrganizedContent => {
  return wikipediaContent.query === undefined ||
    wikipediaContent.query.pages === undefined ||
    wikipediaContent.query.pages[0] === undefined ||
    (wikipediaContent.query.pages[0].missing !== undefined &&
      wikipediaContent.query.pages[0].missing === true) ||
    (wikipediaContent.query.pages[0].extract !== undefined &&
      wikipediaContent.query.pages[0].extract === '')
    ? {
        isMissing: true,
        title: '',
        fullUrl: '',
        extract: '',
        length: 0,
      }
    : {
        isMissing: false,
        title: wikipediaContent.query.pages[0].title,
        fullUrl: wikipediaContent.query.pages[0].fullurl,
        extract: wikipediaContent.query.pages[0].extract,
        length: wikipediaContent.query.pages[0].length,
      };
};
