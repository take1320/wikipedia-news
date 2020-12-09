import React, { FC } from 'react';
import { Menu, Container } from 'semantic-ui-react';

const BasicHeader: FC = () => (
  <Menu borderless>
    <Container text>
      <Menu.Item header>Wikipedia in news</Menu.Item>
    </Container>
  </Menu>
);

export default BasicHeader;
