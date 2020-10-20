import commander from 'commander';
import admin from 'firebase-admin';
import fs from 'fs';
import stringifySync from 'csv-stringify/lib/sync';

import { Publisher } from '../services/wikipedia-news/models/publisher';
import { Article } from '../services/wikipedia-news/models/article';
import { collectionName } from '../services/wikipedia-news/constants';

import serviceAccount from '../wikipedia-news-firebase-adminsdk.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();
const DEST_DIR = './seeds/exports';

const exportCollection = async (collection: string) => {
  console.log('export start');
  const snap = await db.collection(collection).get();

  let exportData = [];
  switch (collection) {
    case collectionName.articles: {
      const docs: Article[] = [];
      snap.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...doc.data(),
        } as Article);
      });

      exportData = docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        url: doc.url,
      }));
      break;
    }

    case collectionName.publishers: {
      const docs: Publisher[] = [];
      snap.forEach((doc) => {
        docs.push(doc.data() as Publisher);
      });

      exportData = docs.map((doc) => ({
        name: doc.name,
        selector: doc.selector ?? '',
        url: doc.url,
      }));
      break;
    }

    default: {
      throw new Error('specify target collection');
    }
  }

  console.log('export array size:' + exportData.length);

  const tsv = stringifySync(exportData, {
    header: true,
    quoted_string: false,
    delimiter: '\t',
  });

  try {
    fs.writeFileSync(`${DEST_DIR}/${collection}.tsv`, tsv);
    console.log('export end');
  } catch (e) {
    console.log(e);
  }
};

commander
  .version('0.1.0', '-v, --version')
  .arguments('<collection>')
  .action(exportCollection);

commander.parse(process.argv);
