import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db, hasValidFirebaseConfig } from '../config/firebase';
import { api } from '../config/api';

const INCIDENTS_KEY = 'smart-campus-safety-incidents';

async function readLocalIncidents() {
  const raw = await AsyncStorage.getItem(INCIDENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function writeLocalIncidents(incidents) {
  await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
}

export async function createIncident(incident, getToken) {
  const payload = {
    ...incident,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (hasValidFirebaseConfig && db) {
    const ref = await addDoc(collection(db, 'incidents'), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const token = await getToken?.();
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      api.post('/api/audit', {
        action: 'incident_created',
        incidentId: ref.id,
        userId: incident.userId
      }).catch(() => {});
    }

    return { ...payload, id: ref.id };
  }

  const incidents = await readLocalIncidents();
  const localIncident = { ...payload, id: `local-${Date.now()}` };
  incidents.unshift(localIncident);
  await writeLocalIncidents(incidents);
  return localIncident;
}

export async function listIncidents(userId, includeAll = false) {
  if (hasValidFirebaseConfig && db) {
    let q;
    if (includeAll) {
      q = query(collection(db, 'incidents'), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'incidents'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  }

  const incidents = await readLocalIncidents();
  return includeAll ? incidents : incidents.filter(item => item.userId === userId || item.userId === 'demo-user-001');
}

export async function updateIncidentStatus(incidentId, status) {
  if (hasValidFirebaseConfig && db) {
    await updateDoc(doc(db, 'incidents', incidentId), {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  }

  const incidents = await readLocalIncidents();
  const next = incidents.map(item => item.id === incidentId ? { ...item, status, updatedAt: new Date().toISOString() } : item);
  await writeLocalIncidents(next);
  return true;
}
