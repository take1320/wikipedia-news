import React, { useContext } from 'react';
import { HogeContext } from '../../contexts';

const Fuga: React.FC = () => {
  const hoge = useContext(HogeContext);

  return (
    <div>
      <p>Fuga</p>
      <p>{hoge}</p>
    </div>
  );
};

export default Fuga;
