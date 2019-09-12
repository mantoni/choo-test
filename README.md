# Choo Test

[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/choo-test/blob/master/LICENSE)

Easy [Choo][] testing for Choo v5, v6 and v7.

## Install

```bash
$ npm install choo-test --save-dev
```

## Usage

Here is an example using [Mochify][] as the test runner:

```js
var assert = require('assert');
var choo = require('choo');
var html = require('choo/html');
var test = require('choo-test');

function model(state, emitter) {
  state.text = 'Test';

  emitter.on('change', () => {
    state.text = 'Changed';
    emitter.emit('render');
  });
}

function view(state, emit) {
  return html`<button onclick=${function () {
    emit('change');
  }}>${state.text}</button>`;
  
}

describe('choo-app', function () {
  var restore;
  var app;

  beforeEach(function () {
    app = choo();
    app.use(model);
    app.route('/', view);
  });

  afterEach(function () {
    restore();
  });

  it('changes the button text on click', function (done) {
    restore = test.start(app);

    test.fire('button', 'click');

    test.onRender(function () {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

});
```

## How does it work?

This module is a collection of helper functions. Each of them can be used
separately.

When you use the `start` function to start your Choo app, it wraps and appends
the application to a `div` tag in the `document.body`. When calling the
returned `restore` function, the DOM node is removed again.

The `onRender` function creates a [MutationObserver][] and invokes the given
callback if any change in the DOM tree happens.

Global window events are captured and unregistered when calling `restore()`.

## API

- `$(selector[, scope])`: Find a DOM element using `querySelector`. `scope`
  must be a DOM node to search and defaults to `document`.
- `$$(selector[, scope])`: Find all DOM element using `querySelectorAll`.
  `scope` must be a DOM node to search and defaults to `document`.
- `fire(selector, event[, args])`: Fire an event using [bean.fire][].
- `onRender([nodeOrSelector, ]fn)`: Register a function to invoke after the
  next DOM mutation occurred. If only a function is given, the entire
  `document` is observed. If no mutation occurs within 1500 ms, a timeout error
  is thrown.
- `start(app)`: Creates a `div` tag and append it to `document.body`, then
  starts the given Choo app and attaches the returned tree to the `div` node.
  Returns a `restore()` function which remove the `div` node from the body.

## Testing XHR

Use the [Sinon.js fake server][sinon-fake-server] for XHR testing. If you're
using the [xhr][] library, you have to initialize the `XMLHttpRequest`
implementation like this:

```js
sandbox = sinon.sandbox.create({
  useFakeServer: true
});
sandbox.stub(xhr, 'XMLHttpRequest', sandbox.server.xhr);
```

## License

MIT

[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/choo-test.svg
[Choo]: https://github.com/choojs/choo
[Mochify]: https://github.com/mantoni/mochify.js
[bean.fire]: https://github.com/fat/bean#fireelement-eventtype-args-
[MutationObserver]: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
[sinon-fake-server]: http://sinonjs.org/docs/#fakeServer
[xhr]: https://www.npmjs.com/package/xhr
