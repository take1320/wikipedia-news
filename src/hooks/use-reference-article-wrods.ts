import { useContext, useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';

// import { NewsArticle } from 'services/wikipedia-news/models/news-article';
import { ReferencedUser } from 'services/wikipedia-news/models/referenced-user';
// import { ReferencedWikipediaArticle } from 'services/wikipedia-news/models/referenced-wikipedia-article';
import { collectionName } from 'services/wikipedia-news/constants';
import { FirebaseContext, UserContext } from 'contexts';

const useReferenceArticleWord = (
  articleId: string,
  title: string,
  url: string,
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const firebaseRef = useRef(useContext(FirebaseContext));
  const userRef = useRef(useContext(UserContext));

  useEffect(() => {
    const { db } = firebaseRef.current;
    if (!db) throw new Error('firestore is not initialized');

    const { user, referencedWikipediaArticles } = userRef.current;
    if (!user) throw new Error('firestore is not initialized');

    // 参照済みか判定する
    const isReferenced = referencedWikipediaArticles.some(
      (r) => r.id === title,
    );

    // 参照済みの場合
    // ユーザの参照ワードに追加する
    // const referencedWikipediaArticleDoc = db
    //   .collection(collectionName.users)
    //   .doc(user.id)
    //   .collection(collectionName.referencedWikipediaArticles)
    //   .doc(title);

    // 記事の参照ユーザに追加する
    const referencedUsersDoc = db
      .collection(collectionName.newsArticles)
      .doc(articleId)
      .collection(collectionName.articleWords)
      .doc(title)
      .collection(collectionName.referencedUsers)
      .doc(user.id);

    // 未参照の場合

    // finally
    // クリックしたリンクを別タブで開く

    const load = async () => {
      setLoading(true);
      try {
        if (isReferenced) {
          return;
        }

        await referencedUsersDoc.set({
          id: user.id,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        } as ReferencedUser);

        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { loading, error };
};

export default useReferenceArticleWord;
