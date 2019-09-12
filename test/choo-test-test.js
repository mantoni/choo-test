/*eslint-env mocha*/
'use strict';

const assert = require('assert');
const choo = require('choo');
const test = require('..');

describe('choo-test', () => {
  let app;
  let restore;

  beforeEach(() => {
    app = choo();
    app.use((state, emitter) => {
      state.text = 'Test';
      emitter.on('change', () => {
        state.text = 'Changed';
        emitter.emit('render');
      });
    });
    app.route('/', (state, emit) => {
      const button = document.createElement('button');
      button.onclick = function () {
        emit('change');
      };
      button.innerText = state.text;
      return button;
    });
  });

  afterEach(() => {
    restore();
    restore = null;
  });

  it('tracks changes in document', (done) => {
    restore = test.start(app);

    test.fire('button', 'click');

    test.onRender(() => {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

  it('tracks changes in given node', (done) => {
    restore = test.start(app);

    test.fire('button', 'click');

    test.onRender(test.$('body'), () => {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

  it('tracks changes in given selector', (done) => {
    restore = test.start(app);

    test.fire('button', 'click');

    test.onRender('body', () => {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

});
