'use strict';

const sinon = require('sinon');
const choo = require('choo');
const http = require('choo/http');

function choo_test() {
  const div = document.createElement('div');
  const sandbox = sinon.sandbox.create();
  const server = sandbox.useFakeServer();
  const clock = sandbox.useFakeTimers();
  const app = choo();
  const start = app.start;
  app.start = () => {
    const tree = start.call(app, {
      history: false,
      href: false,
      hash: false
    });
    div.appendChild(tree);
    clock.tick(1);
  };
  app.$ = (selector) => {
    return div.querySelector(selector);
  };
  app.sandbox = sandbox;
  app.server = server;
  app.clock = clock;
  app.restore = () => {
    sandbox.restore();
  };
  sandbox.stub(http, 'XMLHttpRequest', server.xhr);
  return app;
}

module.exports = choo_test;
