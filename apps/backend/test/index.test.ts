import { app, type App } from '../src/index';
import { treaty, type Treaty } from '@elysiajs/eden';

export const api: Treaty.Create<App> = treaty(app);
