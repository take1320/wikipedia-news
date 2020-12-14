import { useContext, useEffect, useRef, useState } from 'react';

import { Article } from 'services/wikipedia-news/models/article';
import { NewsArticle } from 'services/wikipedia-news/models/news-article';
import { collectionName } from 'services/wikipedia-news/constants';
import { FirebaseContext } from 'contexts';
import { ArticleWord } from 'services/wikipedia-news/models/article-word';

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
    if (!db) throw new Error('irestore is not initialized');

    const load = async () => {
      setLoading(true);
      try {
        const snap = await db
          .collection(collectionName.newsArticles)
          .where('wordAssociated', '==', true)
          .orderBy('createdAt', 'desc')
          .limit(optionsRef.current.limit)
          .get();

        const newsArticles: NewsArticle[] = snap.docs.map(
          (doc) => doc.data() as NewsArticle,
        );

        const articles: Article[] = [];

        for await (const newsArticle of newsArticles) {
          const snap = await db
            .collection(collectionName.newsArticles)
            .doc(newsArticle.article.id)
            .collection(collectionName.articleWords)
            .where('url', '!=', '')
            .get();

          articles.push({
            newsArticle,
            articleWords: snap.docs.map((doc) => doc.data() as ArticleWord),
          });
        }

        console.log('articles:');
        console.log(articles);
        setArticles(articles);
        setError(null);
      } catch (err) {
        console.log('set error');
        console.log(err);
        setError(err);
      }
      setLoading(false);
    };

    load();
  }, []);

  return { articles, loading, error };
};

export default useArticles;
