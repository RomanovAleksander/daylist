/** Сеть недоступна — не ошибка синка, просто ждём сеть. */
export class OfflineError extends Error {}

/** Токен отозван или протух без возможности обновить — нужен повторный вход. */
export class AuthError extends Error {}

/** Файл изменился с момента скачивания — нужно скачать, слить и повторить. */
export class ConflictError extends Error {}

/** Безопасный fetch: обрыв сети превращаем в OfflineError, чтобы не путать с ошибками API. */
export const request = async (input: string, init: RequestInit) => {
  try {
    return await fetch(input, init);
  } catch {
    throw new OfflineError('network');
  }
};
