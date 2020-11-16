import React from 'react';
import styled from '@emotion/styled';

import { NewsArticle } from 'services/wikipedia-news/models/news-article';
import NewsArticleItem from 'components/common/item/NewsArticleItem';

const NewsArticleList: React.FC<{ newsArticles: NewsArticle[] }> = ({
  newsArticles,
}) => {
  const ListWrapper = styled.div`
    margin: 1rem 0.5rem;
  `;

  console.log(newsArticles);

  return (
    <ListWrapper>
      {newsArticles.map((newsArticle) => (
        <NewsArticleItem newsArticle={newsArticle} key={newsArticle.title} />
      ))}
    </ListWrapper>
  );
};

export default NewsArticleList;
