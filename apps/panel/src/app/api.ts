import { edenTreaty } from '@elysiajs/eden';
import { Api } from 'backend-api';

const api = edenTreaty<Api>('http://localhost:8000');

export default api;
