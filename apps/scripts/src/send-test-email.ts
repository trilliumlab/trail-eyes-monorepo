import { mailer } from '@repo/email';

const cmdWorkingDir = process.env.CMD_WD;
if (!cmdWorkingDir) {
  console.error('Script must be called from root package.json!');
  console.error('Usage: bun send-test-email email@example.com');
  process.exit(1);
}

if (process.argv.length !== 3) {
  console.error('Invalid number of cli arguments!');
  console.error('Usage: bun send-test-email email@example.com');
  process.exit(2);
}

const email = process.argv[2]!;

await mailer.sendInvite(email, {
  name: 'Tester McTesterface',
  inviteRole: 'admin',
  invitedByName: 'Inviter McInviterface',
  invitedByEmail: 'inviter@example.com',
});
