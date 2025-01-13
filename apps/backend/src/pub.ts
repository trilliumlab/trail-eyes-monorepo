import { os } from '@orpc/server';
import { contract } from '@repo/contract';

export const pub = os.contract(contract);
