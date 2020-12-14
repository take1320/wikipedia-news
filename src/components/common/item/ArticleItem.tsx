import React, { FC } from 'react';
import styled from '@emotion/styled';
import { List, Segment } from 'semantic-ui-react';

import { Article } from 'services/wikipedia-news/models/article';
import ArticleWordItem from 'components/common/item/ArticleWordItem';

const WORD_DISPLAY_SIZE = 5;
const ArticleWrapper = styled.div`
    margin: 1rem 0;
  `;

const ArticleItem: FC<{ article: Article }> = ({ article }) => (
  <ArticleWrapper>
    <Segment attached="top">
      <div>
        <a
          href={article.newsArticle.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {article.newsArticle.title}
        </a>
      </div>
      <span>Testニュース</span>-<span>2020/07/01公開</span>
    </Segment>
    <Segment attached="bottom">
      <List>
        {article.articleWords.slice(0, WORD_DISPLAY_SIZE).map((word) => (
          <ArticleWordItem articleWord={word} key={word.id} />
        ))}
      </List>
    </Segment>
  </ArticleWrapper>
);

export default ArticleItem;
