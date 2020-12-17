import commander from 'commander';
import admin from 'firebase-admin';

import serviceAccount from '../wikipedia-news-firebase-adminsdk.json';
import { exit } from 'process';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const truncateAuthentication = async (): Promise<void> => {
  const users = await admin.auth().listUsers();
  console.log('users.count: ' + users.users.length);

  await admin.auth().deleteUsers(users.users.map((u) => u.uid));

  exit();
};

commander.version('0.1.0', '-v, --version').action(truncateAuthentication);
commander.parse(process.argv);
