import { useContext, useEffect, useRef, useState } from 'react';

import { Article } from 'services/w-news/models/articles';
import { collectionName } from 'services/w-news/constants';
import { FirebaseContext } from 'contexts';

type ArticlesOptions = {
  limit?: number;
};
const defaultOptions: Required<ArticlesOptions> = {
  limit: 30,
};

const useArticles = (options?: ArticlesOptions) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));
  const optionsRef = useRef({ ...defaultOptions, ...options });

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error('Firestore is not initialized');
    const query = db
      .collection(collectionName.articles)
      .orderBy('createdAt', 'asc')
      .limit(optionsRef.current.limit);

    const load = async () => {
      setLoading(true);
      try {
        const snap = await query.get();
        const articlesData = snap.docs.map((doc) => ({
          ...(doc.data() as Article),
          id: doc.id,
        }));
        console.log('hogehoge');
        console.log(articlesData);
        setArticles(articlesData);
        setError(null);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    load();
  }, []);

  return { articles, loading, error };
};

export default useArticles;
