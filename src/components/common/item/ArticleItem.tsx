import React, { FC } from 'react';
import { Item, List } from 'semantic-ui-react';

import { Article } from 'services/wikipedia-news/models/article';
import ArticleWordItem from 'components/common/item/ArticleWordItem';

const ArticleItem: FC<{ article: Article }> = ({ article }) => (
  <Item.Group>
    <Item>
      <Item.Content>
        <a
          href={article.newsArticle.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Item.Header>{article.newsArticle.title}</Item.Header>
        </a>
        <Item.Meta>
          <span className="publisher">Testニュース</span>
          <span className="publishedAt">2020/07/01公開</span>
        </Item.Meta>
        <List>
          {article.articleWords.map((word) => (
            <ArticleWordItem articleWord={word} key={word.id} />
          ))}
        </List>
      </Item.Content>
    </Item>
  </Item.Group>
);
//   return <div>{article.title}</div>;
// };

export default ArticleItem;
