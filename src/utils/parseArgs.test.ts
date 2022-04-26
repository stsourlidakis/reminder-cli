import { parseArgs } from './parseArgs';

describe('Handles the repeat flag', () => {
  test('Long "--repeat"', () => {
    expect(parseArgs(['foo', 'bar']).repeat).toBe(false);
    expect(parseArgs(['foo', 'bar', '--repeat']).repeat).toBe(true);
  });

  test('Shorthand "-r"', () => {
    expect(parseArgs(['foo', 'bar']).repeat).toBe(false);
    expect(parseArgs(['foo', 'bar', '-r']).repeat).toBe(true);
  });
});

describe('Finds the delay argument', () => {
  test('Single', () => {
    expect(parseArgs(['1h', 'foo']).delay).toBe('1h');
    expect(parseArgs(['10m', 'foo']).delay).toBe('10m');
    expect(parseArgs(['10 m', 'foo']).delay).toBe('10 m');
  });

  test('Multiple', () => {
    expect(parseArgs(['1h', 'foo']).delay).toBe('1h');
    expect(parseArgs(['1h30m', 'foo']).delay).toBe('1h30m');
    expect(parseArgs(['1h 30m', 'foo']).delay).toBe('1h 30m');
  });

  test('Only cares about the first time-like argument', () => {
    expect(parseArgs(['1h', 'foo', '3h']).delay).toBe('1h');
  });
});

describe('Finds the time argument', () => {
  test('24h format', () => {
    expect(parseArgs(['13:37', 'foo']).time).toBe('13:37');
    expect(parseArgs(['23:33', 'foo']).time).toBe('23:33');

    expect(parseArgs(['44:44', 'foo']).time).toBe(undefined);
    expect(parseArgs(['1 3:37', 'foo']).time).toBe(undefined);
    expect(parseArgs(['13 :37', 'foo']).time).toBe(undefined);
    expect(parseArgs(['13: 37', 'foo']).time).toBe(undefined);
    expect(parseArgs(['13:3 7', 'foo']).time).toBe(undefined);
  });

  test('12h format', () => {
    expect(parseArgs(['11:37pm', 'foo']).time).toBe('11:37pm');
    expect(parseArgs(['11:37PM', 'foo']).time).toBe('11:37PM');
    expect(parseArgs(['11:37 Pm', 'foo']).time).toBe('11:37 Pm');
    expect(parseArgs(['11:37 pm', 'foo']).time).toBe('11:37 pm');
    expect(parseArgs(['06:33am', 'foo']).time).toBe('06:33am');
    expect(parseArgs(['6:33am', 'foo']).time).toBe('6:33am');
    expect(parseArgs(['06:33AM', 'foo']).time).toBe('06:33AM');
    expect(parseArgs(['06:33 Am', 'foo']).time).toBe('06:33 Am');
    expect(parseArgs(['06:33 am', 'foo']).time).toBe('06:33 am');

    expect(parseArgs(['17:33 am', 'foo']).time).toBe(undefined);
    expect(parseArgs(['06:77 am', 'foo']).time).toBe(undefined);
    expect(parseArgs(['05:33a m', 'foo']).time).toBe(undefined);
    expect(parseArgs(['05:33 a m', 'foo']).time).toBe(undefined);
    expect(parseArgs(['0 5:33 am', 'foo']).time).toBe(undefined);
    expect(parseArgs(['05:3 3 am', 'foo']).time).toBe(undefined);
    expect(parseArgs(['05: 33 am', 'foo']).time).toBe(undefined);
    expect(parseArgs(['05 :33 am', 'foo']).time).toBe(undefined);
    expect(parseArgs(['04:60 am', 'foo']).time).toBe(undefined);
  });

  test('Only cares about the first time-like argument', () => {
    expect(parseArgs(['13:37', 'foo', '11:55']).time).toBe('13:37');
  });
});

describe('Time vs Delay', () => {
  test('Picks one of the two', () => {
    const res1 = parseArgs(['13:37', '1h']);
    expect(res1.time).toBe('13:37');
    expect(res1.delay).toBe(undefined);
  });

  test('Argument order matters', () => {
    const res1 = parseArgs(['1h', '13:37']);
    expect(res1.delay).toBe('1h');
    expect(res1.time).toBe(undefined);
  });
});

describe('Finds the message argument(s)', () => {
  test('Single argument', () => {
    expect(parseArgs(['13:37', 'foo']).message).toBe('foo');
    expect(parseArgs(['13:37', 'foo bar']).message).toBe('foo bar');
  });

  test('Multiple arguments', () => {
    expect(parseArgs(['13:37', 'foo', 'bar']).message).toBe('foo bar');
    expect(parseArgs(['foo', '13:37', 'bar']).message).toBe('foo bar');
    expect(
      parseArgs(['foo', '13:37', 'bar', '--repeat', '12:55']).message
    ).toBe('foo bar 12:55');
  });
});

describe('Everything works together', () => {
  test("Order doesn't matter", () => {
    expect(parseArgs(['13:37', 'foo'])).toMatchObject({
      time: '13:37',
      message: 'foo',
      repeat: false,
    });

    expect(parseArgs(['--repeat', '13:37', 'foo'])).toMatchObject({
      time: '13:37',
      message: 'foo',
      repeat: true,
    });

    expect(parseArgs(['foo', '-r', '11:37am'])).toMatchObject({
      time: '11:37am',
      message: 'foo',
      repeat: true,
    });

    expect(parseArgs(['foo', '-r', '1h30m'])).toMatchObject({
      delay: '1h30m',
      message: 'foo',
      repeat: true,
    });

    expect(parseArgs([])).toMatchObject({
      time: undefined,
      delay: undefined,
      message: undefined,
      repeat: false,
    });
  });

  test('All arguments are trimmed', () => {
    expect(
      parseArgs([' 13:37    ', '   foo bar 21:15  ', '   --repeat  '])
    ).toMatchObject({
      time: '13:37',
      message: 'foo bar 21:15',
      repeat: true,
    });

    expect(
      parseArgs([' 1h    ', '   foo bar 21:15  ', '   --repeat  '])
    ).toMatchObject({
      delay: '1h',
      message: 'foo bar 21:15',
      repeat: true,
    });
  });
});
