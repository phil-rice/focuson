const { simpleMsg } = require('./index');

it('print the message', () => {
    expect(simpleMsg()).toEqual('This is a message from the simple-lens package');
})