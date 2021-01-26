import React, { FC, useContext } from 'react';
import { List, Label } from 'semantic-ui-react';
import styled from '@emotion/styled';

import { User } from 'services/wikipedia-news/models/user';
import { ArticleWord } from 'services/wikipedia-news/models/article-word';
import { UserContext } from '../../../contexts';
import useReferenceArticleWord from 'hooks/use-reference-article-wrods';

const ArticleWordWrapper = styled.div`
  margin: 0.5rem 0;
`;

const openTabHandler = (
  user: User,
  articleWordId: string,
  url: string,
): ((e: React.MouseEvent) => void) => {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('test:' + url);
    // TODO: sleepはfirestore更新処理に変更
    // clickWikipediaWord(user, articleWordId)
    //   .then(() => {
    //     console.log('id:' + articleWordId);
    //     console.log('url:' + url);
    //   })
    //   .finally(() => {
    //     window.open(url, '_blank', 'noopener');
    //   });
  };
};

const ArticleWordItem: FC<{ articleWord: ArticleWord }> = ({ articleWord }) => {
  const { user, referencedWikipediaArticles } = useContext(UserContext);
  if (!user) throw new Error('user is null');

  console.log('user:' + user.id);
  for (const ref of referencedWikipediaArticles) {
    console.log('ref:' + ref.id);
  }

  const isReferenced = referencedWikipediaArticles.some(
    (r) => r.id === articleWord.title,
  );

  const { loading, error } = useReferenceArticleWord(
    articleWord.newsArticleId,
    articleWord.title ?? '',
    articleWord.url ?? '',
  );

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
                articleWord.id,
                articleWord.url ?? '',
              )}
            >
              {articleWord.title}
            </a>
          </List.Header>
          <List.Description>
            <Label
              as="span"
              content={articleWord.referencedCount?.toLocaleString()}
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
