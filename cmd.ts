// Custom script used to load env variables with dotenvx based on flag passed

import spawn from 'cross-spawn';

// Split args at first occurance of --
const args = process.argv.slice(2);
const split = args.indexOf('--');
const cmdArgs = split === -1 ? args : args.slice(0, split);
const prgmArgs = split === -1 ? [] : args.slice(split + 1);

if (cmdArgs.length < 1) {
  console.error('Invalid usage: No bun script passed!');
  process.exit(2);
}

if (cmdArgs.length > 2) {
  console.error('Invalid usage: Too many arguments passed!');
  process.exit(2);
}

if (cmdArgs[1]?.startsWith('--') === false) {
  console.error('Invalid usage: Second argument must be an environment flag.');
  console.error("To pass arguments to the command, place them after '--'.");
  process.exit(2);
}

const cmd = cmdArgs[0] as string;
const env = cmdArgs[1]?.substring(2);
const envArg = env ? ['-f', `.env.${env}`] : [];

// Set CMD_WD env to working directory
process.env.CMD_WD = process.cwd();

// Launch command and pass stdio
const child = spawn('dotenvx', ['run', ...envArg, '--', 'turbo', cmd, '--', ...prgmArgs], {
  stdio: 'inherit',
}).on('exit', (exitCode, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(exitCode ?? 1);
  }
});

// Forward signals
for (const signal of [
  'SIGINT',
  'SIGTERM',
  'SIGPIPE',
  'SIGHUP',
  'SIGBREAK',
  'SIGWINCH',
  'SIGUSR1',
  'SIGUSR2',
] as const) {
  process.on(signal, () => {
    child.kill(signal);
  });
}
