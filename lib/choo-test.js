'use strict';

let mutationCallback;
window.MutationObserver = (fn) => {
  mutationCallback = fn;
  return {
    observe: () => {}
  };
};

const sinon = require('sinon');
const choo = require('choo');
const http = require('choo/http');
const bean = require('bean');

function choo_test() {
  const div = document.createElement('div');
  const sandbox = sinon.sandbox.create();
  const server = sandbox.useFakeServer();
  const clock = sandbox.useFakeTimers();
  const onError = sandbox.stub();
  const onAction = sandbox.stub();
  const onStateChange = sandbox.stub();
  const app = choo({
    onError: onError,
    onAction: onAction,
    onStateChange: onStateChange
  });
  let redraw = null;
  const start = app.start;
  app.start = () => {
    const tree = start.call(app, {
      history: false,
      href: false,
      hash: false
    });
    div.appendChild(tree);
    const attr = Object.keys(tree.dataset).filter(
      (d) => d.indexOf('onloadid') === 0
    );
    if (attr.length) {
      mutationCallback([{
        attributeName: attr[0],
        addedNodes: [tree],
        removedNodes: []
      }]);
    }
    app.redraw();
  };
  app.$ = (selector) => {
    return div.querySelector(selector);
  };
  app.fire = (selector, event, args) => {
    bean.fire(app.$(selector), event, args);
    clock.tick(1);
  };
  app.sandbox = sandbox;
  app.server = server;
  app.clock = clock;
  app.redraw = () => {
    clock.tick();
    if (redraw) {
      redraw();
      redraw = null;
    }
  };
  app.onAction = onAction;
  app.onStateChange = onStateChange;
  app.onError = onError;
  app.restore = () => {
    sandbox.restore();
  };
  sandbox.stub(http, 'XMLHttpRequest', server.xhr);
  sandbox.stub(window, 'requestAnimationFrame', (fn) => {
    redraw = fn;
  });
  return app;
}

module.exports = choo_test;
