import { $ } from 'bun';

export async function run(cmd: TemplateStringsArray, ...params: string[]) {
  for await (const line of $(cmd, ...params).lines()) {
    console.log(line);
  }
}
