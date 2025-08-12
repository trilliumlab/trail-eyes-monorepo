import { z } from 'zod';

export const boolean = () =>
  z.preprocess((val) => {
    if (typeof val === 'string') {
      if (['1', 'true'].includes(val.toLowerCase())) return true;
      if (['0', 'false'].includes(val.toLowerCase())) return false;
    }
    return val;
  }, z.boolean());

export const stringBoolean = () =>
  z.enum(['1', 'true', '0', 'false']).transform((val) => {
    if (['1', 'true'].includes(val.toLowerCase())) return true;
    return false;
  });
