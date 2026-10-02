import { DROPBOX_APP_KEY, DROPBOX_REDIRECT_URI } from '@/config/app.config';

import { AuthError, request } from './errors';
import { codeChallenge, randomString } from '../utils/pkce';

const TOKENS_KEY = 'daylist-dropbox';
const VERIFIER_KEY = 'daylist-dropbox-verifier';
const STATE_KEY = 'daylist-dropbox-state';
const TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

const readTokens = (): Tokens | null => {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? (JSON.parse(raw) as Tokens) : null;
  } catch {
    return null;
  }
};

const saveTokens = (response: TokenResponse, refreshToken: string) =>
  localStorage.setItem(
    TOKENS_KEY,
    JSON.stringify({
      accessToken: response.access_token,
      refreshToken,
      // Минута запаса: токен не должен протухнуть посреди запроса.
      expiresAt: Date.now() + (response.expires_in - 60) * 1000,
    } satisfies Tokens)
  );

export const isDropboxConfigured = () => DROPBOX_APP_KEY !== '';

export const isConnected = () => readTokens() !== null;

export const startLogin = async () => {
  const verifier = randomString(48);
  const state = randomString(16);
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: DROPBOX_APP_KEY,
    response_type: 'code',
    code_challenge: await codeChallenge(verifier),
    code_challenge_method: 'S256',
    token_access_type: 'offline',
    redirect_uri: DROPBOX_REDIRECT_URI,
    state,
  });
  window.location.assign(`https://www.dropbox.com/oauth2/authorize?${params}`);
};

const postToken = async (body: Record<string, string>): Promise<TokenResponse> => {
  const response = await request(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({ client_id: DROPBOX_APP_KEY, ...body }),
  });
  if (response.status === 400 || response.status === 401) throw new AuthError('token');
  if (!response.ok) throw new Error(`token ${response.status}`);
  return (await response.json()) as TokenResponse;
};

/**
 * Dropbox возвращает `?code=…&state=…` перед `#`, поэтому читаем search, а не hash роутера.
 * Возвращает `true`, если вход только что завершился.
 */
export const completeLoginFromUrl = async (): Promise<boolean> => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return false;

  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  const state = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem(STATE_KEY);
  window.history.replaceState(null, '', DROPBOX_REDIRECT_URI + window.location.hash);

  if (!verifier || params.get('state') !== state) throw new AuthError('state');

  const response = await postToken({
    grant_type: 'authorization_code',
    code,
    code_verifier: verifier,
    redirect_uri: DROPBOX_REDIRECT_URI,
  });
  if (!response.refresh_token) throw new AuthError('no refresh token');
  saveTokens(response, response.refresh_token);
  return true;
};

export const getAccessToken = async (): Promise<string> => {
  const tokens = readTokens();
  if (!tokens) throw new AuthError('not connected');
  if (Date.now() < tokens.expiresAt) return tokens.accessToken;

  const response = await postToken({
    grant_type: 'refresh_token',
    refresh_token: tokens.refreshToken,
  });
  saveTokens(response, tokens.refreshToken);
  return response.access_token;
};

export const disconnect = async () => {
  const tokens = readTokens();
  localStorage.removeItem(TOKENS_KEY);
  if (!tokens) return;
  // Отзыв токена — вежливость: локально мы уже вышли, ошибка сети тут не важна.
  await request('https://api.dropboxapi.com/2/auth/token/revoke', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  }).catch(() => undefined);
};
