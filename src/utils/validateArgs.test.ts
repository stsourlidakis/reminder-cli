import { validateArgs } from './validateArgs';
import {
  noDelayOrTimeErrorMessage,
  noMessageErrorMessage,
  noPastTimeErrorMessage,
} from './constants';

// Edge case: some tests will fail if they are executed on 23:59 local time

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
        time: '23:59',
        message: 'foo',
        repeat: false,
      })
    ).toBe(true);

    expect(
      validateArgs({
        time: '23:59',
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
        time: '23:59',
        message: undefined,
        repeat: false,
      })
    ).toThrow(noMessageErrorMessage);

    expect(() =>
      validateArgs({
        time: '23:59',
        message: undefined,
        repeat: true,
      })
    ).toThrow(noMessageErrorMessage);
  });
});

describe('Rejects time in the past', () => {
  const aMinuteAgo = new Date(new Date().getTime() - 60 * 1000);
  const aMinuteAgo24h = aMinuteAgo.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const aMinuteAgo12h = aMinuteAgo.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  expect(() =>
    validateArgs({
      time: aMinuteAgo24h,
      message: 'foo',
      repeat: false,
    })
  ).toThrow(noPastTimeErrorMessage);

  expect(() =>
    validateArgs({
      time: aMinuteAgo12h,
      message: 'foo',
      repeat: false,
    })
  ).toThrow(noPastTimeErrorMessage);
});
