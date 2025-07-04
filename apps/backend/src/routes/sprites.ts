import { pub } from '../orpc';

export const getSpriteJson = pub.sprites.getSpriteJson.handler(async ({ input, context }) => {
  const file = Bun.file(`../../data/sprites/out/${input.path}.json`);
  const json = await file.json();
  return json;
});

export const getSpritePng = pub.sprites.getSpritePng.handler(async ({ input, context }) => {
  const file = Bun.file(`../../data/sprites/out/${input.path}.png`);
  // return context.reply.send(file.stream());
  return file;
});

export const spritesRouter = {
  getSpriteJson,
  getSpritePng,
};
