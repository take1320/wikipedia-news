import * as ReferencedUserRepository from 'domains/models/referenced-users/referenced-user-repository';
import * as WikipediaArticleRepository from 'domains/models/wikipedia-articles/wikipedia-article-repository';
import { User } from 'domains/models/users/user';

export type TArticleWord = {
  id: string;
  newsArticleId: string;
  title: string | null;
  url: string | null;
  referencedCount: number;
  length: number | null;
  summary: string | null;
  isAssociated: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export class ArticleWord implements TArticleWord {
  id: string;
  newsArticleId: string;
  title: string | null;
  url: string | null;
  referencedCount: number;
  length: number | null;
  summary: string | null;
  isAssociated: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor({
    id,
    newsArticleId,
    title,
    url,
    referencedCount,
    length,
    summary,
    isAssociated,
    createdAt,
    updatedAt,
  }: TArticleWord) {
    this.id = id;
    this.newsArticleId = newsArticleId;
    this.title = title;
    this.url = url;
    this.referencedCount = referencedCount;
    this.length = length;
    this.summary = summary;
    this.isAssociated = isAssociated;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  async reference(user: User): Promise<void> {
    await ReferencedUserRepository.createViaNewsArticle(
      this.newsArticleId,
      this.id,
      user.id,
    );

    const wikipediaArticle = await WikipediaArticleRepository.findById(this.id);

    await wikipediaArticle.reference(user);
  }
}
