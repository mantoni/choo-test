/*eslint-env mocha*/
'use strict';

var assert = require('assert');
var choo = require('choo');
var test = require('..');

describe('choo-test', function () {
  var app;
  var restore;

  beforeEach(function () {
    app = choo();
    app.use(function (state, emitter) {
      state.text = 'Test';
      emitter.on('change', function () {
        state.text = 'Changed';
        emitter.emit('render');
      });
    });
    app.route('/', function (state, emit) {
      var button = document.createElement('button');
      button.onclick = function () {
        emit('change');
      };
      button.innerText = state.text;
      return button;
    });
  });

  afterEach(function () {
    restore();
    restore = null;
  });

  it('tracks changes in document', function (done) {
    restore = test.start(app);

    test.fire('button', 'click');

    test.onRender(function () {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

  it('tracks changes in given node', function (done) {
    restore = test.start(app);

    test.fire('button', 'click');

    test.onRender(test.$('body'), function () {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

  it('tracks changes in given selector', function (done) {
    restore = test.start(app);

    test.fire('button', 'click');

    test.onRender('body', function () {
      assert.equal(test.$('button').innerText, 'Changed');
      done();
    });
  });

});
