import React, { FC, useContext } from 'react';
import { Menu, Container } from 'semantic-ui-react';
import styled from '@emotion/styled';

import { UserContext } from '../../../contexts';

const MenuHeader = styled(Menu)`
  &&& {
    background: #eaecf0;
    border-radius: 0;
  }
`;

const MenuTitle = styled(Menu.Item)`
  &&& {
    color: #4f5051;
    font-family: 'Linux Libertine', Georgia, Times, serif;
    font-size: 1.3rem;
  }
`;

const BasicHeader: FC = () => {
  const user = useContext(UserContext);
  console.log(user);
  return (
    <MenuHeader borderless>
      <Container text>
        <MenuTitle header>ウィキペディア in News</MenuTitle>
      </Container>
    </MenuHeader>
  );
};
export default BasicHeader;
