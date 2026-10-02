import { getAccessToken } from './dropbox.auth';
import { AuthError, ConflictError, request } from './errors';
import { snapshotSchema, type Snapshot } from '../utils/snapshot.schema';

const FILE_PATH = '/data.json';

export interface RemoteFile {
  snapshot: Snapshot;
  rev: string;
}

const authorized = async (url: string, apiArg: object, init: RequestInit = {}) => {
  const response = await request(url, {
    ...init,
    method: 'POST',
    headers: {
      ...init.headers,
      Authorization: `Bearer ${await getAccessToken()}`,
      'Dropbox-API-Arg': JSON.stringify(apiArg),
    },
  });
  if (response.status === 401) throw new AuthError('unauthorized');
  return response;
};

/** `null`, если файла ещё нет — первый синк с этого аккаунта. */
export const downloadSnapshot = async (): Promise<RemoteFile | null> => {
  const response = await authorized('https://content.dropboxapi.com/2/files/download', {
    path: FILE_PATH,
  });
  if (response.status === 409) {
    const body = (await response.json()) as { error_summary?: string };
    if (body.error_summary?.startsWith('path/not_found')) return null;
    throw new Error(body.error_summary ?? 'download conflict');
  }
  if (!response.ok) throw new Error(`download ${response.status}`);

  const meta = JSON.parse(response.headers.get('Dropbox-API-Result') ?? '{}') as { rev?: string };
  // Битый или чужой файл не должен перезаписать локальные данные: parse бросит до merge.
  const snapshot = snapshotSchema.parse(await response.json());
  if (!meta.rev) throw new Error('download without rev');
  return { snapshot, rev: meta.rev };
};

/** Пишет файл только поверх известной ревизии; если его успели изменить — ConflictError. */
export const uploadSnapshot = async (snapshot: Snapshot, rev: string | null): Promise<string> => {
  const response = await authorized(
    'https://content.dropboxapi.com/2/files/upload',
    {
      path: FILE_PATH,
      mode: rev ? { '.tag': 'update', update: rev } : { '.tag': 'add' },
      autorename: false,
      mute: true,
    },
    {
      headers: { 'Content-Type': 'application/octet-stream' },
      body: JSON.stringify(snapshot),
    }
  );
  if (response.status === 409) throw new ConflictError('upload conflict');
  if (!response.ok) throw new Error(`upload ${response.status}`);
  return ((await response.json()) as { rev: string }).rev;
};
