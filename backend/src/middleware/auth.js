const { admin, isFirebaseAdminReady } = require('../config/firebaseAdmin');

async function requireFirebaseAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    if (process.env.ALLOW_UNAUTHENTICATED_DEV === 'true') {
      req.user = { uid: 'dev-user', email: 'dev@example.com' };
      return next();
    }
    return res.status(401).json({ error: 'Missing Firebase ID token.' });
  }

  if (!isFirebaseAdminReady) {
    return res.status(500).json({ error: 'Firebase Admin is not configured on the backend.' });
  }

  try {
    req.user = await admin.auth().verifyIdToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired Firebase ID token.' });
  }
}

module.exports = { requireFirebaseAuth };
