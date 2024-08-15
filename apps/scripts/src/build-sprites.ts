// Change working dir to sprites directory
process.chdir(Bun.fileURLToPath(import.meta.resolve('../../../data/sprites')));
console.log(process.cwd());
