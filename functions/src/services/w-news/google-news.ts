import { firestore } from 'firebase-admin';
import { Article as GNArticle } from '../rakuten-rapid-api/models/google-news';
import { Article } from './models/article';
import { Publisher } from './models/publisher';

export const toArticle = (
  gNArticle: GNArticle,
  publisherRef: firestore.DocumentReference<Publisher>,
): Article => ({
  title: gNArticle.title,
  url: gNArticle.link,
  publisher: publisherRef,
  createdAt: null,
  updatedAt: null,
});

export const toPublisher = (gNArticle: GNArticle): Publisher => ({
  name: gNArticle.source.title,
  url: gNArticle.source.href,
  createdAt: null,
  updatedAt: null,
});
