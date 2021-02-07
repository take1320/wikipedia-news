import React, { FC, useContext, useState, useReducer } from 'react';
import { List, Label } from 'semantic-ui-react';
import styled from '@emotion/styled';

import { User } from 'services/wikipedia-news/models/user';
import { ArticleWord } from 'services/wikipedia-news/models/article-word';
import * as newsArticleService from 'services/wikipedia-news/news-article';
import { UserContext } from 'contexts';

const ArticleWordWrapper = styled.div`
  margin: 0.5rem 0;
`;

const openTabHandler = (
  user: User,
  newsArticleId: string,
  articleWordId: string,
  url: string,
  isReferenced: boolean,
  setReferenced: React.Dispatch<React.SetStateAction<boolean>>,
  referenceCountDispatch: React.Dispatch<string>,
): ((e: React.MouseEvent) => void) => {
  return (e: React.MouseEvent) => {
    e.preventDefault();

    // 参照済みの場合は記録しない
    if (isReferenced) {
      window.open(url, '_blank', 'noopener');
      return;
    }

    window.open(url, '_blank', 'noopener');
    newsArticleService
      .referenceArticleWord(newsArticleId, articleWordId, user.id)
      .then(() => {
        setReferenced(true);
        referenceCountDispatch('increment');
      });
  };
};

const referenceCountReducer = (countState: number, action: string) => {
  switch (action) {
    case 'increment':
      return countState + 1;
    case 'decrement':
      return countState - 1;
    default:
      return countState;
  }
};

const ArticleWordItem: FC<{ articleWord: ArticleWord }> = ({ articleWord }) => {
  const { user, referencedWikipediaArticles } = useContext(UserContext);

  const [isReferenced, setReferenced] = useState<boolean>(
    referencedWikipediaArticles.some((r) => r.id === articleWord.title),
  );
  const [referenceCount, referenceCountDispatch] = useReducer(
    referenceCountReducer,
    articleWord.referencedCount ?? 0,
  );

  if (!user) return <div></div>;

  return (
    <ArticleWordWrapper>
      <List.Item>
        <List.Content>
          <List.Header>
            <a
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              onClick={openTabHandler(
                user,
                articleWord.newsArticleId,
                articleWord.id,
                articleWord.url ?? '',
                isReferenced,
                setReferenced,
                referenceCountDispatch,
              )}
            >
              {articleWord.title}
            </a>
          </List.Header>
          <List.Description>
            <Label
              as="span"
              content={referenceCount.toLocaleString()}
              icon="eye"
              color={isReferenced ? 'red' : undefined}
            />
            <Label
              as="span"
              content={articleWord.length?.toLocaleString() + '文字'}
              icon="file text outline"
            />
            <Label as="span" content={'0'} icon="heart" />
          </List.Description>
        </List.Content>
      </List.Item>
    </ArticleWordWrapper>
  );
};

export default ArticleWordItem;
