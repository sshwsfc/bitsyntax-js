var assert = require('assert');
var parse = require('../').parse;
var construct = require('../').construct;
var constructor = require('../').constructor;
var write = require('../').write;

TEST_CASES = [
  ['n:8', {n:255}, [255]],
  ['n:16', {n: 0xf0f0}, [240, 240]],
  ['n:32', {n: 0x12345678}, [18,52,86,120]],
  ['n:64', {n: 0xffffffffffffffff}, [255,255,255,255,255,255,255,255]],

  ['n:8, s/binary', {n: 255, s: new Buffer("foobar")}, [255, 0x66, 0x6f, 0x6f, 0x62, 0x61, 0x72]],
  ['n:8, "foobar", m:8', {n: 255, m:0}, [255, 0x66, 0x6f, 0x6f, 0x62, 0x61, 0x72, 0]],
];

function bufferToArray(buf) {
  return Array.prototype.slice.call(buf);
}

suite("Construction", function() {
  TEST_CASES.forEach(function(c) {
    var p = parse(c[0]);
    test(c[0], function() {
      assert.deepEqual(c[2], bufferToArray(construct(p, c[1])));
    });
    test(c[0], function() {
      var buf = new Buffer(1024);
      var end = write(buf, 7, p, c[1]);
      buf = buf.slice(7, end);
      assert.deepEqual(c[2], bufferToArray(buf));
    });
    test(c[0], function() {
      var cons = constructor(c[0]);
      var buf = cons(c[1]);
      assert.deepEqual(c[2], bufferToArray(buf));
    });

  });

});
