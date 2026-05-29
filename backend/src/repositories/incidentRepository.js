const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getFirestore } = require('../config/firebaseAdmin');

const dataDir = path.join(process.cwd(), 'data');
const localFile = path.join(dataDir, 'incidents.json');

function readLocal() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(localFile)) fs.writeFileSync(localFile, '[]');
  return JSON.parse(fs.readFileSync(localFile, 'utf8'));
}

function writeLocal(items) {
  fs.writeFileSync(localFile, JSON.stringify(items, null, 2));
}

async function createIncident(payload) {
  const db = getFirestore();
  const now = new Date().toISOString();
  const incident = {
    ...payload,
    status: payload.status || 'submitted',
    createdAt: now,
    updatedAt: now
  };

  if (db) {
    const ref = await db.collection('incidents').add(incident);
    return { id: ref.id, ...incident };
  }

  const items = readLocal();
  const localIncident = { id: crypto.randomUUID(), ...incident };
  items.unshift(localIncident);
  writeLocal(items);
  return localIncident;
}

async function listIncidents() {
  const db = getFirestore();
  if (db) {
    const snapshot = await db.collection('incidents').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  return readLocal();
}

async function updateIncidentStatus(id, status) {
  const db = getFirestore();
  const updatedAt = new Date().toISOString();

  if (db) {
    await db.collection('incidents').doc(id).update({ status, updatedAt });
    return { id, status, updatedAt };
  }

  const items = readLocal();
  const next = items.map(item => item.id === id ? { ...item, status, updatedAt } : item);
  writeLocal(next);
  return { id, status, updatedAt };
}

module.exports = { createIncident, listIncidents, updateIncidentStatus };
