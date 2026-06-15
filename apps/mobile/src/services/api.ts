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
  if (Constants.expoConfig?.hostUri) {
    const hostIp = Constants.expoConfig.hostUri.split(':')[0];
    return `http://${hostIp}:3000`;
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

  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    let message = 'Erro ao comunicar com a API.';
    if (
      payload &&
      typeof payload === 'object' &&
      'message' in payload &&
      typeof (payload as Record<string, unknown>).message === 'string'
    ) {
      message = (payload as Record<string, unknown>).message as string;
    }
    throw new Error(message);
  }

  return payload as T;
}
