import { useContext, useEffect, useRef, useState } from 'react';

import { NewsArticle } from 'services/wikipedia-news/models/news-article';
import { collectionName } from 'services/wikipedia-news/constants';
import { FirebaseContext } from 'contexts';

type ArticlesOptions = {
  limit?: number;
};
const defaultOptions: Required<ArticlesOptions> = {
  limit: 30,
};

const useNewsArticles = (options?: ArticlesOptions) => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));
  const optionsRef = useRef({ ...defaultOptions, ...options });

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error('irestore is not initialized');
    const query = db
      .collection(collectionName.newsArticles)
      .orderBy('createdAt', 'desc')
      .limit(optionsRef.current.limit);

    const load = async () => {
      setLoading(true);
      try {
        const snap = await query.get();
        const articlesData = snap.docs.map((doc) => ({
          ...(doc.data() as NewsArticle),
          id: doc.id,
        }));
        console.log('articlesData:');
        console.log(articlesData);
        setNewsArticles(articlesData);
        setError(null);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    load();
  }, []);

  return { newsArticles, loading, error };
};

export default useNewsArticles;
