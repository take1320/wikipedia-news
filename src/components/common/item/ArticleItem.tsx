import React, { FC } from 'react';
import styled from '@emotion/styled';
import { List, Segment, Divider } from 'semantic-ui-react';

import { Article } from 'services/wikipedia-news/models/article';
import ArticleWordItem from 'components/common/item/ArticleWordItem';
import { fromNow } from 'utils/date';

const WORD_DISPLAY_SIZE = 5;

const ArticleWrapper = styled.div`
  margin: 1rem 0;
`;
const ArticleSegment = styled(Segment)`
  &&& {
    border-color: rgb(167, 215, 249);
    border-radius: 10px;
  }
`;
const TitleAnker = styled.a`
  &&& {
    font-weight: 700;
  }
`;

const ArticleItem: FC<{ article: Article }> = ({ article }) => (
  <ArticleWrapper>
    <ArticleSegment attached="top">
      <div>
        <TitleAnker
          href={article.newsArticle.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {article.newsArticle.title}
        </TitleAnker>
      </div>
      <span>{article.newsArticle.headlineArticle.publisher.name}</span>-
      <span>
        {fromNow(article.newsArticle.headlineArticle.publishedAt.toDate())}
      </span>
      <Divider />
      <List>
        {article.articleWords.slice(0, WORD_DISPLAY_SIZE).map((word) => (
          <ArticleWordItem articleWord={word} key={word.id} />
        ))}
      </List>
    </ArticleSegment>
  </ArticleWrapper>
);

export default ArticleItem;
