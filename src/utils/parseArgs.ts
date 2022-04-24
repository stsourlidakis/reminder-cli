import parseDuration from 'parse-duration';
import { time24hRegex, time12hRegex } from './constants';

export interface ParsedArgs {
  message: string | undefined;
  time?: string;
  delay?: string;
  repeat: boolean;
}

export function parseArgs(args: string[]): ParsedArgs {
  const argsSet = new Set(args.map((arg) => arg.trim()));
  let repeat = false;

  if (argsSet.has('--repeat') || argsSet.has('-r')) {
    repeat = true;

    argsSet.delete('--repeat');
    argsSet.delete('-r');
  }

  let time, delay;

  // Check if any of the arguments is in time or duration format
  for (const arg of argsSet) {
    if (time24hRegex.test(arg) || time12hRegex.test(arg)) {
      time = arg;
      argsSet.delete(time);
      break;
    }

    if (Number.isInteger(parseDuration(arg))) {
      delay = arg;
      argsSet.delete(delay);
      break;
    }
  }

  let message;

  if (argsSet.size > 0) {
    message = [...argsSet].join(' ');
  }

  return {
    time,
    delay,
    message,
    repeat,
  };
}
