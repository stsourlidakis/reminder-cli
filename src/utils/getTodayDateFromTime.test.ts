import { getTodayDateFromTime as func } from './getTodayDateFromTime';

const now = new Date();
now.setSeconds(0);
now.setMilliseconds(0);

now.setHours(22);
now.setMinutes(55);

const beforeMidayExpectedTimestamp = now.toISOString();

now.setHours(10);
now.setMinutes(55);
const afterMidayExpectedTimestamp = now.toISOString();

describe('Returns the correct date', () => {
  test('When time is in 12h format', async () => {
    expect(func('10:55 pm').toISOString()).toBe(beforeMidayExpectedTimestamp);
    expect(func('10:55 am').toISOString()).toBe(afterMidayExpectedTimestamp);
  });

  test('When time is in 24h format', async () => {
    expect(func('22:55').toISOString()).toBe(beforeMidayExpectedTimestamp);
    expect(func('10:55').toISOString()).toBe(afterMidayExpectedTimestamp);
  });
});

describe('Trims input', () => {
  test('When time is in 12h format', async () => {
    expect(func(' 10:55 pm ').toISOString()).toBe(beforeMidayExpectedTimestamp);
  });

  test('When time is in 24h format', async () => {
    expect(func(' 22:55    ').toISOString()).toBe(beforeMidayExpectedTimestamp);
  });
});

describe('Handles 12h variations', () => {
  test('Uppercase', async () => {
    expect(func('10:55 PM').toISOString()).toBe(beforeMidayExpectedTimestamp);
  });

  test('Missing space', async () => {
    expect(func('10:55pm').toISOString()).toBe(beforeMidayExpectedTimestamp);
  });

  test('All of the above', async () => {
    expect(func('10:55PM').toISOString()).toBe(beforeMidayExpectedTimestamp);
  });
});

describe('Throws an error when the time is not in the expected format', () => {
  test('All of the above', async () => {
    expect(() => func('foo')).toThrow();
    expect(() => func('1055am')).toThrow();
    expect(() => func('2955')).toThrow();
  });
});
