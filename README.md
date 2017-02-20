# Choo Test

[![Choo v4]](https://github.com/yoshuawuyts/choo)
[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/choo-test/blob/master/LICENSE)

Easy [Choo][] testing.

## Install

```bash
$ npm install choo-test --save-dev
```

## Usage

Here is an example using [Mochify][] as the test runner:

```js
const assert = require('assert');
const choo = require('choo');
const html = require('choo/html');
const test = require('choo-test');

describe('choo-app', () => {
  let tester;
  let app;

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

  it('changes the button text on click', (done) => {
    app.start();

    tester.fire('button', 'click');

    tester.onRender(() => {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

});
```

## How does it work?

When you create a `tester` instance for a Choo app, it registers [hooks][] with
the application to intercept state changes and action calls. It also wraps the
Choo `start` function and appends the application to a `div` tag in the
`document.body`. When calling `stop` on the `tester`, the DOM node is removed.

The `onRender` function creates a [MutationObserver][] and invokes the given
callback if any change in the DOM tree happens.

## API

- `$(selector)`: Find a DOM element using `querySelector`.
- `$$(selector)`: Find a DOM element using `querySelectorAll`.
- `fire(selector, event[, args])`: Fire an event using [bean.fire][].
- `tester = createTester(app)` creates a tester for the given Choo app.

A `tester` instance has this interface:

- `set([namespace, ]key, value)`: Override initial values in the Choo model.
- `onRender([nodeOrSelector, ]fn)`: Register a function to invoke after the
  next DOM mutation occurred. If only a function is given, the entire
  `document` is observed. If no mutation occurs within 1500 ms, a timeout error
  is thrown.
- `onAction(fn)`: Register a function to invoke after the next Choo action
  call. All [Choo onAction hook][hooks] parameters are forwarded.
- `onStateChange(fn)`: Register a function to invoke after the next Choo state
  change. All [Choo onStateChange hook][hooks] parameters are forwarded.
- `onError(fn)`: Register a function to invoke after the next error occurred.
  All [Choo onError hook][hooks] parameters are forwarded.
- `stop()`: Stops the Choo app and removes the test DOM node from the body.

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

[Choo v4]: https://img.shields.io/badge/built%20with%20choo-v4-ffc3e4.svg?style=flat-square
[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/choo-test.svg
[Choo]: https://github.com/yoshuawuyts/choo
[Mochify]: https://github.com/mantoni/mochify.js
[bean.fire]: https://github.com/fat/bean#fireelement-eventtype-args-
[hooks]: https://github.com/yoshuawuyts/choo#appusehooks
[MutationObserver]: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
[sinon-fake-server]: http://sinonjs.org/docs/#fakeServer
[xhr]: https://www.npmjs.com/package/xhr
