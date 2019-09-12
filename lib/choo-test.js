/*
 * choo-tests
 *
 * Copyright (c) 2017 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

const bean = require('bean');

exports.$ = function (selector, scope) {
  return (scope || document).querySelector(selector);
};

exports.$$ = function (selector, scope) {
  return (scope || document).querySelectorAll(selector);
};

exports.fire = function (selector, event, args) {
  const node = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;
  bean.fire(node, event, args);
};

exports.onRender = function (node, fn) {
  if (typeof node === 'function') {
    fn = node;
    node = document;
  } else if (typeof node === 'string') {
    node = document.querySelector(node);
  }
  try {
    // Make the error traceable
    throw new Error('Timeout waiting for expected DOM modification');
  } catch (err) {
    let t = null;
    const o = new MutationObserver((() => {
      clearTimeout(t);
      o.disconnect();
      requestAnimationFrame(() => {
        try {
          fn();
        } catch (e) {
          const er = new Error(e.message);
          er.stack = `${e.stack}\n${err.stack.split('\n').slice(2).join('\n')}`;
          throw er;
        }
      });
    }));
    t = setTimeout(() => {
      o.disconnect();
      throw err;
    }, 1500);
    o.observe(node, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true
    });
  }
};

const eventListeners = [];

const addEventListener = window.addEventListener;
window.addEventListener = function (event, callback, capture) {
  eventListeners.push({ event, callback });
  addEventListener.call(this, event, callback, capture);
};

exports.start = function (app) {
  const node = document.createElement('div');
  document.body.appendChild(node);
  node.appendChild(app.start());
  return function restore() {
    eventListeners.forEach((item) => {
      window.removeEventListener(item.event, item.callback);
    });
    document.body.removeChild(node);
  };
};
