import React, { FC, useContext } from 'react';
import { Menu, Container } from 'semantic-ui-react';

import { UserContext } from '../../../contexts';

const BasicHeader: FC = () => {
  const hoge = useContext(UserContext);
  console.log(hoge);
  return (
    <Menu borderless>
      <Container text>
        <Menu.Item header>Wikipedia in news</Menu.Item>
        <button
          onClick={() => {
            alert('hoge' + hoge.user?.name);
          }}
        />
      </Container>
    </Menu>
  );
};
export default BasicHeader;
