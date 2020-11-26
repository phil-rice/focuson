const { GenerateBuild } = require('./index');

it('print the message', () => {
    expect(GenerateBuild()).toEqual('This package transpiles the code suitable for code on demand');
})