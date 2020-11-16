import React, { FC } from 'react';
import { Item, List } from 'semantic-ui-react';

import { Article } from 'services/w-news/models/articles';

const ArticleItem: FC<{ article: Article }> = ({ article }) => (
  <Item.Group>
    <Item>
      <Item.Content>
        <a href={article.url} rel="noopener noreferrer" target="_blank">
          <Item.Header>{article.title}</Item.Header>
        </a>
        <Item.Meta>
          <span className="publisher">Testニュース</span>
          <span className="publishedAt">2020/07/01公開</span>
        </Item.Meta>

        <List>
          <List.Item>
            <List.Icon name="book" />
            <List.Content>
              <List.Header>
                <a
                  href="https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  日本（テスト用記事）
                </a>
              </List.Header>
              <List.Description>参照数: 5</List.Description>
              <List.List>
                <List.Item>
                  <List.Icon name="book" />
                  <List.Content>
                    <List.Header>Header</List.Header>
                    <List.Description>Description</List.Description>
                  </List.Content>
                </List.Item>
              </List.List>
            </List.Content>
          </List.Item>
        </List>
      </Item.Content>
    </Item>
  </Item.Group>
);
//   return <div>{article.title}</div>;
// };

export default ArticleItem;
