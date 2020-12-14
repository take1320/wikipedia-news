import React, { FC } from 'react';
import { Segment, Container, Grid, Header, List } from 'semantic-ui-react';

const BasicFooter: FC = () => (
  <Segment vertical >
    <Container>
      <Header as='h4'>
        Footer Header
        </Header>
      <p>
        Extra space for a call to action inside the footer that could help re-engage users.
        </p>
    </Container>
  </Segment>
);

export default BasicFooter;
