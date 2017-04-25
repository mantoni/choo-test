/*
 * choo-tests
 *
 * Copyright (c) 2017 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var bean = require('bean');

exports.$ = function (selector) {
  return document.querySelector(selector);
};

exports.$$ = function (selector) {
  return document.querySelectorAll(selector);
};

exports.fire = function (selector, event, args) {
  var node = typeof selector === 'string'
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
    // Make the error traceable in PhantomJS
    throw new Error('Timeout waiting for expected DOM modification');
  } catch (err) {
    var t = null;
    var o = new MutationObserver(function () {
      clearTimeout(t);
      o.disconnect();
      requestAnimationFrame(fn);
    });
    t = setTimeout(function () {
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

exports.start = function (app) {
  var node = document.createElement('div');
  document.body.appendChild(node);
  node.appendChild(app.start());
  return function restore() {
    document.body.removeChild(node);
  };
};
