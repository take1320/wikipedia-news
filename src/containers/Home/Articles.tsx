import React from 'react';

import Articles from 'components/Home/Articles';
import useArticles from 'hooks/use-articles';

const ArticlesContainer: React.FC = () => {
  const { articles, loading } = useArticles({ limit: 50 });

  return <Articles articles={articles} loading={loading} />;
};

export default ArticlesContainer;
