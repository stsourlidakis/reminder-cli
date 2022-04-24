import type { ParsedArgs } from './parseArgs';
import {
  noDelayOrTimeErrorMessage,
  noMessageErrorMessage,
  noPastTimeErrorMessage,
} from './constants';
import { getTodayDateFromTime } from './getTodayDateFromTime';

export function validateArgs(args: ParsedArgs): boolean {
  if (!args.delay && !args.time) {
    throw new Error(noDelayOrTimeErrorMessage);
  }

  if (args.time) {
    const now = new Date();
    const targetDatetime = getTodayDateFromTime(args.time);

    if (now > targetDatetime) {
      throw new Error(noPastTimeErrorMessage);
    }
  }

  if (!args.message) {
    throw new Error(noMessageErrorMessage);
  }

  return true;
}
