import { User } from 'domains/models/users/user';
import * as ReferencedUserRepository from 'domains/models/referenced-users/referenced-user-repository';

export type IWikipediaArticle = {
  id: string;
  title: string | null;
  url: string | null;
  length: number | null;
  referencedCount: number | 0;
  summary: string | null;
  isSearched: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export class WikipediaArticle {
  private value: IWikipediaArticle;

  constructor(value: IWikipediaArticle) {
    this.value = value;
  }

  get(): IWikipediaArticle {
    return this.value;
  }

  async reference(user: User): Promise<void> {
    await ReferencedUserRepository.createViaWikipediaArticle(
      this.value.id,
      user.getId(),
    );
  }
}
