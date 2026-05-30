import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

export async function attachAuthToken(getToken) {
  const token = await getToken?.();
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
