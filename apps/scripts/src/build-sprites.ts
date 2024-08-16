import { $ } from 'bun';

async function run(cmd: TemplateStringsArray, ...params: string[]) {
  for await (const line of $(cmd, ...params).lines()) {
    console.log(line);
  }
}

// Change working dir to sprites directory
process.chdir(Bun.fileURLToPath(import.meta.resolve('../../../data/sprites')));

run`spreet light out/light`;
run`spreet light out/light@2x`;
run`spreet dark out/dark`;
run`spreet dark out/dark@2x`;
