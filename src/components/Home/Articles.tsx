import React from 'react';
import '../../App.css';

import { Article } from 'services/w-news/models/articles';
import ListLoader from 'components/common/atomos/ListLoader';
import ArticleList from 'components/common/list/ArticleList';

type ArticlesProps = { articles: Article[]; loading?: boolean };

const Articles: React.FC<ArticlesProps> = ({ articles, loading }) => (
  <div>{loading ? <ListLoader /> : <ArticleList articles={articles} />}</div>
);

export default Articles;
