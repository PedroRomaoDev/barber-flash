import { apiFetch } from './api';

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: string;
};

export type GoogleAuthResponse = {
  accessToken: string;
  user: AuthenticatedUser;
};

export const loginWithGoogleToken = async (
  token: string,
): Promise<GoogleAuthResponse> =>
  apiFetch<GoogleAuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<GoogleAuthResponse> =>
  apiFetch<GoogleAuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const registerWithEmail = async (
  name: string,
  email: string,
  password: string,
): Promise<GoogleAuthResponse> =>
  apiFetch<GoogleAuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
