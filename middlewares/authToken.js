import admin from 'firebase-admin'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


async function authToken(req, res, next) {
  const header = req.headers?.authorization;
  if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err.message)
    }
  }
  next();
}

export default authToken;
