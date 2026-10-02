import { describe, expect, it } from 'vitest';

import { codeChallenge, randomString } from './pkce';

describe('pkce', () => {
  it('builds the RFC 7636 S256 challenge', async () => {
    // Пример из приложения B RFC 7636.
    expect(await codeChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'
    );
  });

  it('makes url-safe verifiers of valid length', () => {
    const verifier = randomString();

    expect(verifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });
});
