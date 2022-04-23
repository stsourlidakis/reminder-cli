import { foo } from './index';

test('Returns foo', async () => {
  expect(foo()).toBe('foo');
});
