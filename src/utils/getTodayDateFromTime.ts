import { time12hRegex, time24hRegex } from './constants';

export function getTodayDateFromTime(time: string): Date {
  time = time
    .trim()
    .toLowerCase()
    .replace(/\s*pm/, ' pm')
    .replace(/\s*am/, ' am');

  if (!time12hRegex.test(time) && !time24hRegex.test(time)) {
    throw new Error('Invalid time format');
  }

  const todayDateString = new Date()
    .toLocaleString()
    .split(' ')[0]
    .replace(/-/g, '/');

  return new Date(`${todayDateString} ${time}`);
}
