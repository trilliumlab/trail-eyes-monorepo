import { StartClient } from '@tanstack/start';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createRouter } from './router';

const router = createRouter();

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>,
);
