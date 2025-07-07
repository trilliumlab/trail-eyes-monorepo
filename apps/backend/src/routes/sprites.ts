import { pub } from '../orpc';

export const getSprite = pub.sprites.getSprite.handler(async ({ input, context }) => {
  const file = Bun.file(`../../data/sprites/out/${input.path}`);
  return file;
});

// export const getSpritePng = pub.sprites.getSpritePng.handler(async ({ input, context }) => {
//   const file = Bun.file(`../../data/sprites/out/${input.path}`);
//   // return context.reply.send(file.stream());
//   return file;
// });

export const spritesRouter = {
  getSprite,
  // getSpritePng,
};
