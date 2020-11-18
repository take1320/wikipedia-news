import React from 'react';
import styled from '@emotion/styled';

import { Article } from 'services/wikipedia-news/models/article';
import ArticleItem from 'components/common/item/ArticleItem';

const NewsArticleList: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const ListWrapper = styled.div`
    margin: 1rem 0.5rem;
  `;

  console.log(articles);

  return (
    <ListWrapper>
      {articles.map((article) => (
        <ArticleItem article={article} key={article.newsArticle.title} />
      ))}
    </ListWrapper>
  );
};

export default NewsArticleList;
