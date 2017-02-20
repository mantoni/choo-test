/*eslint-env mocha*/
'use strict';

const assert = require('assert');
const choo = require('choo');
const html = require('choo/html');
const bean = require('bean');
const test = require('..');

describe('choo-test', () => {
  let app;
  let tester;

  beforeEach(() => {
    app = choo();
    app.model({
      state: { text: 'Test' },
      reducers: {
        change: () => ({ text: 'Changed' })
      }
    });
    app.router(['/', (state, prev, send) =>
      html`<button onclick=${() => send('change')}>${state.text}</button>`
    ]);
    tester = test.createTester(app);
  });

  afterEach(() => {
    tester.stop();
  });

  it('tracks changes in document', (done) => {
    app.start();

    test.fire('button', 'click');

    tester.onRender(() => {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

  it('tracks changes in given node', (done) => {
    app.start();

    test.fire('button', 'click');

    tester.onRender(test.$('body'), () => {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

  it('tracks changes in given selector', (done) => {
    app.start();

    test.fire('button', 'click');

    tester.onRender('body', () => {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

  it('invokes onAction callback', (done) => {
    app.start();

    tester.onAction((state) => {
      assert.equal(state.text, 'Test');
      done();
    });

    test.fire('button', 'click');
  });

  it('invokes onStateChange callback', (done) => {
    app.start();

    tester.onStateChange((state) => {
      assert.equal(state.text, 'Changed');
      done();
    });

    test.fire('button', 'click');
  });

  it('invokes onError callback if reducer throws', (done) => {
    const error = new Error();
    app.model({
      subscriptions: [(send, done) => { done(error); }]
    });

    tester.onError((err) => {
      assert.strictEqual(err, error);
      done();
    });

    app.start();
  });

  it('throws error if no onError callback was registered', () => {
    app.model({
      subscriptions: [(send, done) => { done(new Error('Ouch')); }]
    });

    assert.throws(() => {
      app.start();
    }, /Error: Ouch/);
  });

  it('does not throw in restore if app was not started', () => {
    assert.doesNotThrow(() => {
      tester.stop();
    });
  });

  it('does not invoke action after stop', (done) => {
    app.start();
    tester.onAction(() => {
      done(new Error('Unexpected'));
    });
    const button = test.$('button');

    tester.stop();
    bean.fire(button, 'click');

    setTimeout(done, 5);
  });

  it('applies the given initial state', () => {
    tester.set('text', 'Initial');

    app.start();

    assert.equal(test.$('button').innerText, 'Initial');
  });

  it('applies the given initial state with namespace', (done) => {
    tester.set('ns', 'thing', 'Initial');
    app.model({
      namespace: 'ns',
      state: { thing: 'Thingy', other: 'Unchanged' }
    });
    app.start();

    tester.onStateChange((state) => {
      assert.equal(state.ns.thing, 'Initial');
      assert.equal(state.ns.other, 'Unchanged');
      done();
    });
    test.fire('button', 'click');
  });

});
