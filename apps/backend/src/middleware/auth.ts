// import { lucia } from '@repo/database/auth';
// import { getCookie } from 'hono/cookie';
// import { createMiddleware } from 'hono/factory';
// import type { User, Session } from 'lucia';

// export const auth = createMiddleware<{
//   Variables: {
//     user: User | null;
//     session: Session | null;
//   };
// }>(async (ctx, next) => {
//   const sessionId = getCookie(ctx, lucia.sessionCookieName) ?? null;
//   if (!sessionId) {
//     ctx.set('user', null);
//     ctx.set('session', null);
//     return next();
//   }
//   const { session, user } = await lucia.validateSession(sessionId);
//   if (session?.fresh) {
//     ctx.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), { append: true });
//   }
//   if (!session) {
//     ctx.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), { append: true });
//   }
//   ctx.set('user', user);
//   ctx.set('session', session);
//   return next();
// });
