import admin from 'firebase-admin';

admin.initializeApp();

const functionMap = {
  fetchHeadlines: './functions/fetch-headlines',
  crawlArticles: './functions/crawl-articles',
  extractArticleWords: './functions/extract-article-words',
  fetchWikipedia: './functions/fetch-wikipedia',
};

const loadFunctions = (fnMap: typeof functionMap) => {
  for (const [functionName, path] of Object.entries(fnMap)) {
    if (
      !process.env.FUNCTION_TARGET ||
      process.env.FUNCTION_TARGET === functionName
    ) {
      module.exports[functionName] = require(path);
    }
  }
};

loadFunctions(functionMap);
