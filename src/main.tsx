import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Providers } from './app/providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <h1>Daylist</h1>
    </Providers>
  </StrictMode>
);
