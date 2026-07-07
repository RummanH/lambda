import axios from 'axios';
import { authService } from './authService';

// TODO(AWS): once deployed, VITE_API_URL should point at the API Gateway
// invoke URL (e.g. https://xxxx.execute-api.<region>.amazonaws.com/prod)
// instead of the local NestJS server.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the current access token to every outgoing request.
// TODO(AWS): once Cognito is integrated, make sure this reads a token
// that has been verified/refreshed by Amplify rather than a raw value.
api.interceptors.request.use((config) => {
  const token = authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
