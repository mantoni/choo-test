/*eslint-env mocha*/
'use strict';

const assert = require('assert');
const html = require('choo/html');
const http = require('choo/http');
const choo_test = require('..');

describe('choo-test', () => {
  let app;

  beforeEach(() => {
    app = choo_test();
    app.router((route) => [
      route('/', () => {
        return html`<button>Test</button>`;
      })
    ]);
    app.start();
  });

  afterEach(() => {
    app.restore();
  });

  it('allows to query element with $', () => {
    const b = app.$('button');

    assert.equal(b.textContent, 'Test');
  });

  it('exposes sandbox', () => {
    assert.equal(typeof app.sandbox.stub, 'function');
  });

  it('exposes clock', () => {
    assert.equal(typeof app.clock.tick, 'function');
  });

  it('exposes server', () => {
    assert.equal(typeof app.server.respondWith, 'function');
    assert.equal(typeof app.server.respond, 'function');
  });

  it('makes choo/http requests against fake server', () => {
    http.get('/some/url', () => {});

    assert.equal(app.server.requests.length, 1);
  });

});
