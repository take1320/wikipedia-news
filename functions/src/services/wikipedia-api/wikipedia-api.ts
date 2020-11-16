import fetch from 'node-fetch';
import { WikipediaContent } from './models/wikipedia-content';

const ENDPOINT_URL = 'https://ja.wikipedia.org/w/api.php';

export const fetchContentByTitle = async (
  title: string,
): Promise<WikipediaContent> => {
  // TODO:titleの入力チェック・書こう
  if (!title) throw new Error('title is empty');

  console.log('fetchContentByTitle:' + title);

  const queries = new URLSearchParams();

  queries.set('action', 'query');
  queries.set('format', 'json');
  queries.set('redirects', '1');
  queries.set('exchars', '300');
  queries.set('explaintext', '1');
  queries.set('inprop', 'url');
  queries.set('prop', 'info|extracts');
  queries.set('formatversion', '2');
  queries.set('titles', title);

  const url = `${ENDPOINT_URL}?${queries.toString()}`;
  const res = await fetch(url);
  const content: WikipediaContent = await res.json();

  return content;
};
