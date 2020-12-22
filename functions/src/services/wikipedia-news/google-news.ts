import { firestore } from 'firebase-admin';
import { Article as GNArticle } from '../rakuten-rapid-api/models/google-news';
import { HeadlineArticle } from './models/headline-articles';
import { Publisher } from './models/publisher';
import { findPublisherRef, findById } from '../../firestore-admin/publisher';

export const toHeadlineArticles = async (
  gNArticles: GNArticle[],
  db: firestore.Firestore,
): Promise<HeadlineArticle[]> => {
  const headlineArticles: HeadlineArticle[] = [];

  for (const gNArticle of gNArticles) {
    const publisherRef = findPublisherRef(db, gNArticle.source.title);
    const testPublisher = await findById(db, gNArticle.source.title);

    headlineArticles.push({
      id: gNArticle.id,
      title: gNArticle.title,
      url: gNArticle.link,
      publisherRef: publisherRef,
      testPublisher: testPublisher,
      hasDetail: false,
      createdAt: null,
      updatedAt: null,
    });
  }

  return headlineArticles;
};

export const toPublisher = (gNArticle: GNArticle): Publisher => ({
  name: gNArticle.source.title,
  url: gNArticle.source.href,
  selector: null,
  createdAt: null,
  updatedAt: null,
});

export const toPublishers = (gNArticles: GNArticle[]): Publisher[] =>
  gNArticles.map((gNArticle: GNArticle): Publisher => toPublisher(gNArticle));
