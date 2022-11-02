const math = require('./math');

test('adds 0 + 0 to equal 0', () => {
  expect(math.sum(0, 0)).toBe(0);
});
