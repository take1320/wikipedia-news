import commander from 'commander';
import admin from 'firebase-admin';

import sleep from '../await-sleep';
import serviceAccount from '../wikipedia-news-firebase-adminsdk.json';
import { exit } from 'process';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const truncateAuthentication = async (): Promise<void> => {
  const users = await admin.auth().listUsers();
  console.log('users.count: ' + users.users.length);

  for await (const user of users.users) {
    await admin.auth().deleteUser(user.uid);
    await sleep(50); // 速すぎると`QUOTA_EXCEEDED`になるので適当に間隔を開ける
  }

  exit();
};

commander.version('0.1.0', '-v, --version').action(truncateAuthentication);
commander.parse(process.argv);
