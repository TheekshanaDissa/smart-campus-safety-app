const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function loadCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialPath) {
    const resolvedPath = path.resolve(process.cwd(), credentialPath);
    if (fs.existsSync(resolvedPath)) {
      return admin.credential.cert(require(resolvedPath));
    }
  }

  return null;
}

function initializeFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const credential = loadCredential();
  if (credential) {
    admin.initializeApp({ credential });
    return admin;
  }

  if (process.env.FIREBASE_PROJECT_ID && !String(process.env.FIREBASE_PROJECT_ID).includes('YOUR_')) {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
    return admin;
  }

  return null;
}

const firebaseAdmin = initializeFirebaseAdmin();

function getFirestore() {
  if (!firebaseAdmin) return null;
  try {
    return firebaseAdmin.firestore();
  } catch (error) {
    return null;
  }
}

module.exports = { admin: firebaseAdmin || admin, getFirestore, isFirebaseAdminReady: Boolean(firebaseAdmin) };
