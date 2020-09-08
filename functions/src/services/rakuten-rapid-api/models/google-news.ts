export type GoogleNews = {
  feed: Feed;
  articles: Article[];
};

export type Feed = {
  title: string;
  updated: string;
  link: string;
  language: string;
  subtitle: string;
  rights: string;
};

export type Article = {
  id: string;
  title: string;
  link: string;
  published: string;
  sub_titles: SubArticle[];
  source: Source;
};

export type SubArticle = {
  url: string;
  title: string;
  published: string;
};

export type Source = {
  href: string;
  title: string;
};
