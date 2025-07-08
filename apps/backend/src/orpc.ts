import { implement } from '@orpc/server';
import { contract } from '@repo/contract';
import { ResponseHeadersPluginContext } from '@orpc/server/plugins'

export interface ORPCContext extends ResponseHeadersPluginContext {}
  
export const pub = implement(contract)
    .$context<ORPCContext>()
    // .use(dbProviderMiddleware)
  
//   export const authed = pub.use(({ context, next }) => {
//     if (!context.user) {
//       throw new ORPCError('UNAUTHORIZED')
//     }

//     return next({
//       context: {
//         user: context.user,
//       },
//     })
//   })

// export const os = implement(contract);
