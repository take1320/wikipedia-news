import React, { FC } from 'react';
import { Button, Card } from 'semantic-ui-react';

import { Article } from 'services/wikipedia-news/models/articles';

const ArticleCard: FC<{ article: Article }> = ({ article }) => (
  <Card.Group>
    <Card>
      <Card.Content>
        <Card.Header>{article.title}</Card.Header>
        <Card.Description>{article.url}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="green">
            Approve
          </Button>
          <Button basic color="red">
            Decline
          </Button>
        </div>
      </Card.Content>
    </Card>
  </Card.Group>
);
//   return <div>{article.title}</div>;
// };

export default ArticleCard;
