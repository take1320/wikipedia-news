import { firestore } from 'firebase-admin';
import { Article as GNArticle } from '../rakuten-rapid-api/models/google-news';
import { Article } from './models/article';
import { Publisher } from './models/publisher';
import { findPublisherRef } from '../../firestore-admin/publisher';

export const toArticle = (
  gNArticle: GNArticle,
  db: firestore.Firestore,
): Article => {
  const publisherRef = findPublisherRef(db, gNArticle.source.title);
  if (!publisherRef) throw new Error('publisher not found');
  return {
    title: gNArticle.title,
    url: gNArticle.link,
    publisher: publisherRef,
    hasDetail: false,
    createdAt: null,
    updatedAt: null,
  };
};

export const toArticles = (
  gNArticles: GNArticle[],
  db: firestore.Firestore,
): Article[] =>
  gNArticles.map((gNArticle: GNArticle): Article => toArticle(gNArticle, db));

export const toPublisher = (gNArticle: GNArticle): Publisher => ({
  name: gNArticle.source.title,
  url: gNArticle.source.href,
  selector: null,
  createdAt: null,
  updatedAt: null,
});

export const toPublishers = (gNArticles: GNArticle[]): Publisher[] =>
  gNArticles.map((gNArticle: GNArticle): Publisher => toPublisher(gNArticle));
