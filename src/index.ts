import { execaCommand } from 'execa';
import parseDuration from 'parse-duration';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from './utils/parseArgs';
import { validateArgs } from './utils/validateArgs';
import yargsParser from 'yargs-parser';

try {
  const { verbose, silent, _ } = yargsParser(process.argv.slice(2), {
    boolean: ['verbose', 'silent'],
    configuration: {
      'unknown-options-as-args': true,
    },
  });
  const parsedArgs = parseArgs(_.map(String));

  validateArgs(parsedArgs);

  const mode = parsedArgs.repeat ? 'interval' : 'timeout';

  const __dirname = dirname(fileURLToPath(import.meta.url));

  const command = [
    'node',
    `${__dirname}/notifier`,
    '--mode',
    mode,
    '--timeout',
    parseDuration(parsedArgs.delay || '5s'),
    '--message',
    parsedArgs.message.replace(/ /g, '\\ '), // escape spaces
  ].join(' ');

  const subprocess = execaCommand(command, {
    detached: true,
    stdio: 'ignore',
  });

  subprocess.unref();

  if (!silent) {
    console.log(`Registered new notification, pid: ${subprocess.pid}`);
  }

  if (verbose && !silent) {
    console.log(command);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
