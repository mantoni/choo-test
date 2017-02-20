'use strict';

const bean = require('bean');

exports.$ = function (selector) {
  return document.querySelector(selector);
};

exports.$$ = function (selector) {
  return document.querySelectorAll(selector);
};

exports.fire = function (selector, event, args) {
  const node = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;
  bean.fire(node, event, args);
};

function onRender(node, fn) {
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
    let t = null;
    const o = new MutationObserver(() => {
      clearTimeout(t);
      o.disconnect();
      requestAnimationFrame(fn);
    });
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
}

exports.createTester = function (app) {
  let action = null;
  let stateChange = null;
  let error = null;
  let node = null;
  const props = {};

  app.use({
    wrapInitialState: (state) => {
      for (const ns in props) {
        if (props.hasOwnProperty(ns)) {
          const map = props[ns];
          for (const key in map) {
            if (map.hasOwnProperty(key)) {
              if (ns === '@') {
                state[key] = map[key];
              } else {
                state[ns][key] = map[key];
              }
            }
          }
        }
      }
      return state;
    },
    onAction: function () {
      if (action) {
        const args = Array.prototype.slice.call(arguments);
        const fn = action;
        setTimeout(() => {
          fn.apply(null, args);
        }, 1);
        action = null;
      }
    },
    onStateChange: function () {
      if (stateChange) {
        const args = Array.prototype.slice.call(arguments);
        const fn = stateChange;
        setTimeout(() => {
          fn.apply(null, args);
        }, 1);
        stateChange = null;
      }
    },
    onError: function (err) {
      if (error) {
        const args = Array.prototype.slice.call(arguments);
        const fn = error;
        setTimeout(() => {
          fn.apply(null, args);
        }, 1);
        error = null;
      } else {
        throw err;
      }
    }
  });

  const start = app.start;
  app.start = function () {
    const n = start.apply(this, arguments);
    node = document.createElement('div');
    node.appendChild(n);
    document.body.appendChild(node);
    return n;
  };

  return {

    set: function (ns, key, value) {
      if (arguments.length === 2) {
        value = key;
        key = ns;
        ns = '@';
      }
      if (!props[ns]) {
        props[ns] = {};
      }
      props[ns][key] = value;
    },

    onRender: onRender,

    onAction: (fn) => {
      action = fn;
    },

    onStateChange: (fn) => {
      stateChange = fn;
    },

    onError: (fn) => {
      error = fn;
    },

    stop: () => {
      app.stop();
      if (node) {
        document.body.removeChild(node);
        node = null;
      }
    }

  };
};
