import { firestore } from 'firebase-admin';
import { Article as GNArticle } from '../rakuten-rapid-api/models/google-news';
import { HeadlineArticle } from './models/headline-articles';
import { Publisher } from './models/publisher';
import { findPublisherRef } from '../../firestore-admin/publisher';

export const toHeadlineArticle = (
  gNArticle: GNArticle,
  db: firestore.Firestore,
): HeadlineArticle => {
  const publisherRef = findPublisherRef(db, gNArticle.source.title);
  if (!publisherRef) throw new Error('publisher not found');
  return {
    id: gNArticle.id,
    title: gNArticle.title,
    url: gNArticle.link,
    publisher: publisherRef,
    hasDetail: false,
    createdAt: null,
    updatedAt: null,
  };
};

export const toHeadlineArticles = (
  gNArticles: GNArticle[],
  db: firestore.Firestore,
): HeadlineArticle[] =>
  gNArticles.map(
    (gNArticle: GNArticle): HeadlineArticle => toHeadlineArticle(gNArticle, db),
  );

export const toPublisher = (gNArticle: GNArticle): Publisher => ({
  name: gNArticle.source.title,
  url: gNArticle.source.href,
  selector: null,
  createdAt: null,
  updatedAt: null,
});

export const toPublishers = (gNArticles: GNArticle[]): Publisher[] =>
  gNArticles.map((gNArticle: GNArticle): Publisher => toPublisher(gNArticle));
