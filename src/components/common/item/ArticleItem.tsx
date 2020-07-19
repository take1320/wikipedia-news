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
          <span className="publisher">NHKニュース</span>
          <span className="publishedAt">2020/07/01公開</span>
        </Item.Meta>

        <List>
          <List.Item>
            <List.Icon name="book" />
            <List.Content>
              <List.Header>
                <a
                  href="https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E3%82%A2%E3%83%8B%E3%83%A1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E6%94%BE%E7%81%AB%E6%AE%BA%E4%BA%BA%E4%BA%8B%E4%BB%B6"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  京都アニメーション放火殺人事件
                </a>
              </List.Header>
              <List.Description>参照数: 5</List.Description>
              <List.List>
                <List.Item>
                  <List.Icon name="book" />
                  <List.Content>
                    <List.Header>site</List.Header>
                    <List.Description>Your site's theme</List.Description>
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
