import fetch from 'node-fetch';
import { GoogleNews } from './models/google-news';

const TOP_HEADLINES_URL = 'https://google-news.p.rapidapi.com/v1/top_headlines';

export const fetchTopHeadLines = async (
  apiKey: string,
): Promise<GoogleNews> => {
  const queries = new URLSearchParams();
  queries.set('lang', 'jp');
  queries.set('country', 'JP');

  const headers = {
    'x-rapidapi-host': 'google-news.p.rapidapi.com',
    'x-rapidapi-key': apiKey,
    useQueryString: 'true',
  };

  const url = `${TOP_HEADLINES_URL}?${queries.toString()}`;
  const res = await fetch(url, {
    headers,
  });
  const googleNews: GoogleNews = await res.json();

  return googleNews;
};
