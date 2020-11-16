export type WikipediaContent = {
  batchcomplete: boolean;
  query?: Query;
};

export type Query = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warnings?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redirects?: Array<any>;
  pages?: Array<Page>;
};

export type Redirects = {
  redirectss: string;
  pages: string;
};

export type Page = {
  pageid: number;
  title: string;
  fullurl: string;
  extract: string;
  missing?: boolean;
  length: number;
};
