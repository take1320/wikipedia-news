import React, { FC } from 'react';
import { List } from 'semantic-ui-react';

import { ArticleWord } from 'services/wikipedia-news/models/article-word';

const ArticleWordItem: FC<{ articleWord: ArticleWord }> = ({ articleWord }) => (
  <List.Item>
    <List.Icon name="book" />
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
      <List.Description>参照数: 5</List.Description>
    </List.Content>
  </List.Item>
);
//   return <div>{article.title}</div>;
// };

export default ArticleWordItem;
