import Constants from 'expo-constants';
import { Platform } from 'react-native';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiRequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
  token?: string;
};

const resolveApiBaseUrl = (): string => {
  const configuredUrl = Constants.expoConfig?.extra?.apiUrl;

  if (typeof configuredUrl === 'string' && configuredUrl.trim().length > 0) {
    return configuredUrl.replace(/\/+$/, '');
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
};

const API_BASE_URL = resolveApiBaseUrl();

const buildHeaders = (
  headers: Record<string, string> = {},
  token?: string,
): Record<string, string> => {
  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  return mergedHeaders;
};

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = 'GET', headers, body, token } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(headers, token),
    body,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (payload && typeof payload.message === 'string' && payload.message) ||
      'Erro ao comunicar com a API.';
    throw new Error(message);
  }

  return payload as T;
}
