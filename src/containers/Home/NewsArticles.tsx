import React from 'react';

import NewsArticles from 'components/Home/NewsArticles';
import useNewsArticles from 'hooks/use-news-articles';

const ArticlesContainer: React.FC = () => {
  const { newsArticles, loading } = useNewsArticles({ limit: 50 });

  return <NewsArticles newsArticles={newsArticles} loading={loading} />;
};

export default ArticlesContainer;
