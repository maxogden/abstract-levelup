// dont dynamically generate requires here to keep browserify compat
module.exports = function(test, common) {
  require('./test/approximate-size-test.js').all(test, common)
  require('./test/argument-checking-test.js').all(test, common)
  require('./test/batch-test.js').all(test, common)
  // require('./test/binary-test.js').all(test, common)
  // require('./test/compression-test.js').all(test, common)
  // require('./test/copy-test.js.js').all(test, common)
  // require('./test/deferred-open-test.js').all(test, common)
  // require('./test/destroy-repair-test.js').all(test, common)
  // require('./tes./tencoding-test.js').all(test, common)
  // require('./test/get-put-del-test.js').all(test, common)
  // require('./test/idempotent-test.js').all(test, common)
  // require('./test/init-test.js').all(test, common)
  // require('./test/inject-encoding-test.js').all(test, common)
  // require('./test/json-test.js').all(test, common)
  // require('./test/key-value-streams-test.js').all(test, common)
  // require('./test/leveldown-substitution-test.js').all(test, common)
  // require('./test/null-and-undefined-test.js').all(test, common)
  // require('./test/open-patchsafe-test.js').all(test, common)
  // require('./test/optional-leveldown-test.js').all(test, common)
  // require('./test/read-stream-test.js').all(test, common)
  // require('./test/snapshot-test.js').all(test, common)
  // require('./test/write-stream-test').all(test, common)
}
