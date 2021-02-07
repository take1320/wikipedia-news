import { User } from 'domains/models/users/user';
import * as ArticleWordRepository from 'domains/models/article-words/article-word-repository';

export type INewsArticle = {
  id: string;
  title: string;
  text: string;
  rawText: string | null;
  url: string;
  wordExtracted: boolean;
  wordAssociated: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export class NewsArticle {
  private value: INewsArticle;

  constructor(value: INewsArticle) {
    this.value = value;
  }

  async referenceWord(articleWordId: string, user: User): Promise<void> {
    const articleWord = await ArticleWordRepository.findByNewsArticleIdAndArticleWordId(
      this.value.id,
      articleWordId,
    );

    await articleWord.reference(user);
  }
}
