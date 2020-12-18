import React from 'react';
import { Container, Header, Divider } from 'semantic-ui-react';
import styled from '@emotion/styled';
import '../../App.css';

import { Article } from 'services/wikipedia-news/models/article';
import ListLoader from 'components/common/atomos/ListLoader';
import ArticleList from 'components/common/list/ArticleList';

const HeadlineHeader = styled(Header)`
  &&& {
    font-family: 'Linux Libertine', Georgia, Times, serif;
    padding-top: 1rem;
  }
`;

type ArticlesProps = { articles: Article[]; loading?: boolean };

const Articles: React.FC<ArticlesProps> = ({ articles, loading }) => (
  <div>
    <Container text>
      <HeadlineHeader as="h2">新しい News</HeadlineHeader>
      <Divider />
      <div>
        {loading ? <ListLoader /> : <ArticleList articles={articles} />}
      </div>
    </Container>
  </div>
);

export default Articles;
