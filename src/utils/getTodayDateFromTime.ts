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
    .toLocaleString('en-GB') // Formats local datetime to en-GB
    .split(',')[0]
    .split('/')
    .reverse()
    .join('/');

  return new Date(`${todayDateString} ${time}`);
}
