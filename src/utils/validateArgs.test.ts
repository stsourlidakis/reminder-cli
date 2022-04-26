import { validateArgs } from './validateArgs';
import {
  noDelayOrTimeErrorMessage,
  noMessageErrorMessage,
  noPastTimeErrorMessage,
} from './constants';

const now = new Date();
const pastTime24hFormattted = getHHMM(now, false);
const pastTime12hFormattted = getHHMM(now, true);

// Edge case: Some test will fail at 23:59 local time

const futureTime24hFormattted = '23:59';

function getHHMM(d: Date, hour12 = false): string {
  return d.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  });
}

describe('Accepts valid argument combinations', () => {
  test('Delay with/without repeat is valid', async () => {
    expect(
      validateArgs({
        delay: '1h',
        message: 'foo',
        repeat: false,
      })
    ).toBe(true);

    expect(
      validateArgs({
        delay: '1h',
        message: 'foo',
        repeat: true,
      })
    ).toBe(true);
  });

  test('Time with/without repeat is valid', async () => {
    expect(
      validateArgs({
        time: futureTime24hFormattted,
        message: 'foo',
        repeat: false,
      })
    ).toBe(true);

    expect(
      validateArgs({
        time: futureTime24hFormattted,
        message: 'foo',
        repeat: true,
      })
    ).toBe(true);
  });
});

describe('Rejects invalid argument combinations', () => {
  test('No time or delay returns an error', async () => {
    expect(() =>
      validateArgs({
        message: 'foo',
        repeat: false,
      })
    ).toThrow(noDelayOrTimeErrorMessage);

    expect(() =>
      validateArgs({
        message: 'foo',
        repeat: true,
      })
    ).toThrow(noDelayOrTimeErrorMessage);
  });

  test('No message returns an error', async () => {
    expect(() =>
      validateArgs({
        delay: '1h',
        message: undefined,
        repeat: false,
      })
    ).toThrow(noMessageErrorMessage);

    expect(() =>
      validateArgs({
        delay: '1h',
        message: undefined,
        repeat: true,
      })
    ).toThrow(noMessageErrorMessage);

    expect(() =>
      validateArgs({
        time: futureTime24hFormattted,
        message: undefined,
        repeat: false,
      })
    ).toThrow(noMessageErrorMessage);

    expect(() =>
      validateArgs({
        time: futureTime24hFormattted,
        message: undefined,
        repeat: true,
      })
    ).toThrow(noMessageErrorMessage);
  });
});

describe('Rejects time in the past', () => {
  expect(() =>
    validateArgs({
      time: pastTime24hFormattted,
      message: 'foo',
      repeat: false,
    })
  ).toThrow(noPastTimeErrorMessage);

  expect(() =>
    validateArgs({
      time: pastTime12hFormattted,
      message: 'foo',
      repeat: false,
    })
  ).toThrow(noPastTimeErrorMessage);
});
