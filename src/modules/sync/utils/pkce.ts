const base64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

export const randomString = (byteLength = 32) =>
  base64Url(crypto.getRandomValues(new Uint8Array(byteLength)));

export const codeChallenge = async (verifier: string) =>
  base64Url(
    new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)))
  );
