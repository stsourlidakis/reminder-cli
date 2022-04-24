import parseDuration from 'parse-duration';

export function parseArgs(args: string[]): {
  time: string | undefined;
  delay: string | undefined;
  message: string | undefined;
  repeat: boolean;
} {
  const argsSet = new Set(args.map((arg) => arg.trim()));
  let repeat = false;

  if (argsSet.has('--repeat') || argsSet.has('-r')) {
    repeat = true;

    argsSet.delete('--repeat');
    argsSet.delete('-r');
  }

  let time, delay;

  const time24hRegex = new RegExp(/^([01]\d|2[0-3]):([0-5]\d)$/);
  const time12hRegex = new RegExp(
    /^(0?[0-9]|1[012]):[0-5][0-9] ?((a|p|A|P)m|(a|p|A|P)M)$/
  );

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
