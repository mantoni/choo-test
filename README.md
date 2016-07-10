# Choo Test

Easy [Choo][] testing with [Sinon][].

## Install

```
$ npm install choo-test --save-dev
```

## Usage

This example would require [Mochify][], but any test framework that runs
headless or in a real browser should work.

```js
const choo_test = require('choo-test');
const assert = require('assert');
const my_view = require('../lib/my-view');

describe('choo-app', () => {
  let app;

  beforeEach(() => {
    app = choo_test();
    app.router((route) => [route('/', my_view)]);
    app.start();
  });

  afterEach(() => {
    app.restore();
  });

  it('renders the view', () => {
    const b = app.$('h1');

    assert.equal(b.className, 'chugga-chugga-choo-choo');
  });

});
```

## API

- `app = choo_test()` creates and returns a test Choo app.
- `app.start()` a wrapper for `choo.start()` which appends the tree to a `div`
  element.
- `app.$(selector)` find a DOM element using `querySelector`.
- `app.sandbox` the [Sinon sandbox][].
- `app.server` the [Sinon fake server][].
- `app.clock` the [Sinon fake clock][].
- `app.restore` restores the sandbox.

[Choo]: https://github.com/yoshuawuyts/choo
[Sinon]: http://sinonjs.org
[Mochify]: https://github.com/mantoni/mochify.js
[Sinon sandbox]: http://sinonjs.org/docs/#sandbox
[Sinon fake server]: http://sinonjs.org/docs/#fakeServer
[Sinon fake clock]: http://sinonjs.org/docs/#clock
