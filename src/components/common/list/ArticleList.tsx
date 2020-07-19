import React from 'react';
import styled from '@emotion/styled';

import { Article } from 'services/w-news/models/articles';
import ArticleItem from 'components/common/item/ArticleItem';

const ArticleList: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const ListWrapper = styled.div`
    margin: 1rem 0.5rem;
  `;

  console.log(articles);

  return (
    <ListWrapper>
      {articles.map((article) => (
        <ArticleItem article={article} key={article.title} />
      ))}
    </ListWrapper>
  );
};

export default ArticleList;
