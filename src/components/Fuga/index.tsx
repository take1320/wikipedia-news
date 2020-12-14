import React, { useContext, useEffect, useState, useRef } from 'react';
import { HogeContext, FirebaseContext } from '../../contexts';
import { collectionName } from '../../services/wikipedia-news/constants';
import { Article } from '../../services/wikipedia-news/models/articles';

const Fuga: React.FC = () => {
  const hoge = useContext(HogeContext);
  const [count, setCount] = useState(0);

  const [article, setArticle] = useState<Article | null>(null);
  const firebase = useRef(useContext(FirebaseContext));

  useEffect(() => {
    const articles = async () => {
      const { db } = firebase.current;
      if (!db) throw new Error('firebase not initialized');
      const articleCollection = db.collection(collectionName.articles);

      const doc = await articleCollection.doc('Ni2i3o0mylutYPQRyq3Z').get();
      const articleData = doc.data() as Article;
      setArticle(articleData);
    };
    articles();
  }, [count]);

  return (
    <div>
      <p>Fuga</p>
      <p>{hoge}</p>
      <p>{process.env.REACT_APP_AUTH_DOMAIN}</p>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>カウント</button>
      <p>{article?.url ?? 'Loading...'}</p>
    </div>
  );
};

export default Fuga;
