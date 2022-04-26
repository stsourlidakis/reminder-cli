import { getTodayDateFromTime as func } from './getTodayDateFromTime';

const now = new Date();
now.setMilliseconds(0);
now.setSeconds(0);

now.setHours(10);
now.setMinutes(55);
const beforeMiddayExpectedTimestamp = now.toISOString();

now.setHours(22);
now.setMinutes(55);

const afterMiddayExpectedTimestamp = now.toISOString();

describe('Returns the correct date', () => {
  test('When time is in 12h format', () => {
    expect(func('10:55 am').toISOString()).toBe(beforeMiddayExpectedTimestamp);
    expect(func('10:55 pm').toISOString()).toBe(afterMiddayExpectedTimestamp);
  });

  test('When time is in 24h format', () => {
    expect(func('10:55').toISOString()).toBe(beforeMiddayExpectedTimestamp);
    expect(func('22:55').toISOString()).toBe(afterMiddayExpectedTimestamp);
  });
});

describe('Trims input', () => {
  test('When time is in 12h format', () => {
    expect(func(' 10:55 pm ').toISOString()).toBe(afterMiddayExpectedTimestamp);
  });

  test('When time is in 24h format', () => {
    expect(func(' 22:55    ').toISOString()).toBe(afterMiddayExpectedTimestamp);
  });
});

describe('Handles 12h variations', () => {
  test('Uppercase', () => {
    expect(func('10:55 PM').toISOString()).toBe(afterMiddayExpectedTimestamp);
  });

  test('Missing space', () => {
    expect(func('10:55pm').toISOString()).toBe(afterMiddayExpectedTimestamp);
  });

  test('All of the above', () => {
    expect(func('10:55PM').toISOString()).toBe(afterMiddayExpectedTimestamp);
  });
});

describe('Throws an error when the time is not in the expected format', () => {
  test('All of the above', () => {
    expect(() => func('foo')).toThrow();
    expect(() => func('1055am')).toThrow();
    expect(() => func('2955')).toThrow();
  });
});
