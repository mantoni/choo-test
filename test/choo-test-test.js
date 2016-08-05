/*eslint-env mocha*/
/*eslint-disable strict*/// bel uses Function.caller
const assert = require('assert');
const sinon = require('sinon');
const choo_test = require('..');
const html = require('choo/html');
const http = require('choo/http');

const default_router = (route) => [
  route('/', () => {
    return html`<button>Test</button>`;
  })
];

describe('choo-test', () => {
  let app;

  beforeEach(() => {
    app = choo_test();
  });

  afterEach(() => {
    app.restore();
  });

  function start(router) {
    app.router(router || default_router);
    app.start();
  }

  it('allows to query element with $', () => {
    start();
    const b = app.$('button');

    assert.equal(b.textContent, 'Test');
  });

  it('allows to query multiple elements with $$', () => {
    start();
    const b = app.$$('button');

    assert.equal(b.length, 1);
    assert.equal(b[0].textContent, 'Test');
  });

  it('exposes sandbox', () => {
    start();

    assert.equal(typeof app.sandbox.stub, 'function');
  });

  it('exposes clock', () => {
    start();

    assert.equal(typeof app.clock.tick, 'function');
  });

  it('exposes server', () => {
    start();

    assert.equal(typeof app.server.respondWith, 'function');
    assert.equal(typeof app.server.respond, 'function');
  });

  it('makes choo/http requests against fake server', () => {
    start();

    http.get('/some/url', () => {});

    assert.equal(app.server.requests.length, 1);
  });

  it('invokes onAction when send is called', () => {
    app.model({
      effects: {
        someAction: (data, state, send, _done) => {}
      }
    });
    start((route) => [
      route('/', (data, prev, send) => {
        return html`<button onclick=${() => send('someAction')}>Test</button>`;
      })
    ]);

    app.fire('button', 'click');

    sinon.assert.calledOnce(app.onAction);
    sinon.assert.calledWith(app.onAction, null, sinon.match.object,
      'someAction', sinon.match.any, sinon.match.func);
  });

  it('invokes onError if effect invokes done with error', () => {
    const err = new Error();
    app.model({
      effects: {
        throws: (data, state, send, done) => {
          done(err);
        }
      }
    });
    start((route) => [
      route('/', (data, prev, send) => {
        return html`<button onclick=${() => send('throws')}>Test</button>`;
      })
    ]);

    app.fire('button', 'click');

    sinon.assert.calledOnce(app.onError);
    sinon.assert.calledWith(app.onError, err);
  });

  it('invokes onStateChange if reducer changed the state', () => {
    app.model({
      reducers: {
        change: () => {
          return { hi: 'there' };
        }
      }
    });
    start((route) => [
      route('/', (data, prev, send) => {
        return html`<button onclick=${() => send('change')}>Test</button>`;
      })
    ]);

    app.fire('button', 'click');

    sinon.assert.calledOnce(app.onStateChange);
    sinon.assert.calledWith(app.onStateChange, null, sinon.match({
      hi: 'there'
    }), sinon.match.object, 'change', sinon.match.func);
  });

  it('invokes effect onload on root element', () => {
    const spy = sinon.spy();
    app.model({
      effects: {
        init: spy
      }
    });

    start((route) => [
      route('/', (data, prev, send) => {
        return html`<div onload=${() => send('init')}></div>`;
      })
    ]);

    sinon.assert.calledOnce(spy);
  });

  it('invokes effect onload on nested element', () => {
    const spy = sinon.spy();
    app.model({
      effects: {
        init: spy
      }
    });

    start((route) => [
      route('/', (data, prev, send) => {
        return html`<div><b onload=${() => send('init')}></b></div>`;
      })
    ]);

    sinon.assert.calledOnce(spy);
  });

  it('yields to requestAnimationFrame on redraw', () => {
    const spy = sinon.spy();
    start();

    window.requestAnimationFrame(spy);
    app.redraw();

    sinon.assert.calledOnce(spy);
  });

  it('initially redraws after onload', () => {
    app.model({
      state: { test: 'initial' },
      reducers: {
        init: () => ({ test: 'changed' })
      }
    });

    start((route) => [
      route('/', (data, prev, send) => {
        return html`<div onload=${() => send('init')}>${data.test}</div>`;
      })
    ]);

    assert.equal(app.$('div').textContent, 'changed');
  });

});
