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
