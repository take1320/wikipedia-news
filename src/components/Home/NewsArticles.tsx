import React from 'react';
import '../../App.css';

import { NewsArticle } from 'services/wikipedia-news/models/news-article';
import ListLoader from 'components/common/atomos/ListLoader';
import NewsArticleList from 'components/common/list/NewsArticleList';

type NewsArticlesProps = { newsArticles: NewsArticle[]; loading?: boolean };

const NewsArticles: React.FC<NewsArticlesProps> = ({
  newsArticles,
  loading,
}) => (
  <div>
    {loading ? <ListLoader /> : <NewsArticleList newsArticles={newsArticles} />}
  </div>
);

export default NewsArticles;
