import { contract } from '@repo/contract';
import { initServer } from '@ts-rest/fastify';

const s = initServer();

export const spritesRouter = s.router(contract.sprites, {
  getSpriteJson: async ({ params: { path }, reply }) => {
    const file = Bun.file(`../../data/sprites/out/${path}.json`);
    return reply.send(file.stream());
  },
  getSpritePng: async ({ params: { path }, reply }) => {
    const file = Bun.file(`../../data/sprites/out/${path}.png`);
    return reply.send(file.stream());
  },
});
