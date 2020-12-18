import React, { FC } from 'react';
import { List, Label } from 'semantic-ui-react';
import styled from '@emotion/styled';

import { ArticleWord } from 'services/wikipedia-news/models/article-word';

const ArticleWordWrapper = styled.div`
  margin: 0.5rem 0;
`;

const ArticleWordItem: FC<{ articleWord: ArticleWord }> = ({ articleWord }) => (
  <ArticleWordWrapper>
    <List.Item>
      <List.Content>
        <List.Header>
          <a
            href={articleWord.url ?? undefined}
            rel="noopener noreferrer"
            target="_blank"
          >
            {articleWord.title}
          </a>
        </List.Header>
        <List.Description>
          <Label
            as="span"
            content={articleWord.length?.toLocaleString()}
            icon="eye"
          />
          <Label
            as="span"
            content={articleWord.length?.toLocaleString() + '文字'}
            icon="file text outline"
          />
          <Label
            as="span"
            content={articleWord.length?.toLocaleString()}
            icon="heart"
          />
        </List.Description>
      </List.Content>
    </List.Item>
  </ArticleWordWrapper>
);

export default ArticleWordItem;
