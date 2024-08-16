import { run } from './util';

// Change working dir to sprites directory
process.chdir(Bun.fileURLToPath(import.meta.resolve('../../../data/sprites')));

// Regular sprites
run`spreet --unique light out/light`;
run`spreet --unique --retina light out/light@2x`;
run`spreet --unique dark out/dark`;
run`spreet --unique --retina dark out/dark@2x`;

// Sdf sprites (monocolor)
run`spreet --sdf --unique sdf out/sdf`;
run`spreet --sdf --unique --retina sdf out/sdf@2x`;
