process.argv = ['node', 'jest', '--arg1', '1', '--arg2', 'hello']

const argv = require('./argv');

test('argv', () => {
    expect(argv).toEqual(['--arg1', '1', '--arg2', 'hello']);
});