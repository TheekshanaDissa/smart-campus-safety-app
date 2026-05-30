import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, hasValidFirebaseConfig } from '../config/firebase';

const AuthContext = createContext(null);
const MOCK_USER_KEY = 'smart-campus-safety-demo-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasValidFirebaseConfig && auth) {
      const unsubscribe = onAuthStateChanged(auth, currentUser => {
        setUser(currentUser);
        setLoading(false);
      });
      return unsubscribe;
    }

    AsyncStorage.getItem(MOCK_USER_KEY)
      .then(value => {
        if (value) setUser(JSON.parse(value));
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async ({ name, email, password }) => {
    if (hasValidFirebaseConfig && auth) {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      setUser({ ...credential.user, displayName: name });
      return credential.user;
    }

    const demoUser = {
      uid: `demo-${Date.now()}`,
      email,
      displayName: name,
      isDemo: true
    };
    await AsyncStorage.setItem(MOCK_USER_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  };

  const login = async ({ email, password }) => {
    if (hasValidFirebaseConfig && auth) {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setUser(credential.user);
      return credential.user;
    }

    const demoUser = {
      uid: 'demo-user-001',
      email,
      displayName: email.split('@')[0] || 'Demo User',
      isDemo: true
    };
    await AsyncStorage.setItem(MOCK_USER_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  };

  const logout = async () => {
    if (hasValidFirebaseConfig && auth) {
      await signOut(auth);
    }
    await AsyncStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
  };

  const getToken = async () => {
    if (hasValidFirebaseConfig && auth?.currentUser) {
      return auth.currentUser.getIdToken();
    }
    return null;
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, getToken, firebaseReady: hasValidFirebaseConfig }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
