import axios from 'axios';
import { authService } from './authService';

// TODO(AWS): once deployed, VITE_API_URL should point at the API Gateway
// invoke URL (e.g. https://xxxx.execute-api.<region>.amazonaws.com/prod)
// instead of the local NestJS server.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the current access token to every outgoing request. Amplify's
// session lookup is async (it may silently refresh an expired token),
// so this interceptor is async too.
api.interceptors.request.use(async (config) => {
  const token = await authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
