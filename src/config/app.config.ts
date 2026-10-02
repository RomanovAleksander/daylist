// App key не секрет: PKCE-клиент работает без App secret, ключ всё равно виден в бандле.
export const DROPBOX_APP_KEY = import.meta.env.VITE_DROPBOX_APP_KEY ?? '';

/** Адрес, на который Dropbox вернёт после входа; должен быть в Redirect URIs приложения. */
export const DROPBOX_REDIRECT_URI = `${window.location.origin}${import.meta.env.BASE_URL}`;
