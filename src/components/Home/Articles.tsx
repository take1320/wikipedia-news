import React from 'react';
import { Container } from 'semantic-ui-react';
import '../../App.css';

import { Article } from 'services/wikipedia-news/models/article';
import BasicHeader from 'components/common/header/BasicHeader';
import ListLoader from 'components/common/atomos/ListLoader';
import ArticleList from 'components/common/list/ArticleList';

type ArticlesProps = { articles: Article[]; loading?: boolean };

const Articles: React.FC<ArticlesProps> = ({ articles, loading }) => (
  <div>
    <BasicHeader />
    <Container text>
      <div>
        {loading ? <ListLoader /> : <ArticleList articles={articles} />}
      </div>
    </Container>
  </div>
);

export default Articles;
