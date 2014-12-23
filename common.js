/* Copyright (c) 2012-2014 LevelUP contributors
 * See list at <https://github.com/rvagg/node-levelup#contributing>
 * MIT License <https://github.com/rvagg/node-levelup/blob/master/LICENSE.md>
 */

var crypto  = require('crypto')
  , async   = require('async')
  , rimraf  = require('rimraf')
  , fs      = require('fs')
  , path    = require('path')
  , delayed = require('delayed').delayed
  , dbidx   = 0

module.exports.nextLocation = function () {
  return path.join(__dirname, '_levelup_test_db_' + dbidx++)
}

module.exports.cleanup = function (callback) {
  fs.readdir(__dirname, function (err, list) {
    if (err) return callback(err)

    list = list.filter(function (f) {
      return (/^_levelup_test_db_/).test(f)
    })

    if (!list.length)
      return callback()

    var ret = 0

    list.forEach(function (f) {
      rimraf(path.join(__dirname, f), function () {
        if (++ret == list.length)
          callback()
      })
    })
  })
}

module.exports.openTestDatabase = function () {
  var options = typeof arguments[0] == 'object' ? arguments[0] : { createIfMissing: true, errorIfExists: true }
    , callback = typeof arguments[0] == 'function' ? arguments[0] : arguments[1]
    , location = typeof arguments[0] == 'string' ? arguments[0] : module.exports.nextLocation()

  rimraf(location, function (err) {
    if (err) t.ifErr(err, 'no err')
    this.cleanupDirs.push(location)
    this.levelup(location, options, function (err, db) {
      if (err) t.ifErr(err, 'no err')
      if (!err) {
        this.closeableDatabases.push(db)
        callback(db)
      }
    }.bind(this))
  }.bind(this))
}

module.exports.commonTearDown = function (done) {
  async.forEach(
      this.closeableDatabases
    , function (db, callback) {
        db.close(callback)
      }
    , module.exports.cleanup.bind(null, done)
  )
}

module.exports.loadBinaryTestData = function (callback) {
  fs.readFile(path.join(__dirname, 'test/data/testdata.bin'), callback)
}

module.exports.binaryTestDataMD5Sum = '920725ef1a3b32af40ccd0b78f4a62fd'

module.exports.checkBinaryTestData = function (t, testData) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(testData)
  t.equals(md5sum.digest('hex'), module.exports.binaryTestDataMD5Sum)
}

module.exports.commonSetUp = function (levelup, done) {
  this.levelup = levelup
  this.cleanupDirs = []
  this.closeableDatabases = []
  this.openTestDatabase = module.exports.openTestDatabase.bind(this)
  this.timeout = 10000
  module.exports.cleanup(done)
}

module.exports.readStreamSetUp = function (done) {
  module.exports.commonSetUp.call(this, function () {
    var i, k

    this.dataSpy    = this.spy()
    this.endSpy     = this.spy()
    this.sourceData = []

    for (i = 0; i < 100; i++) {
      k = (i < 10 ? '0' : '') + i
      this.sourceData.push({
          type  : 'put'
        , key   : k
        , value : Math.random()
      })
    }

    this.verify = delayed(function (rs, done, data) {
      if (!data) data = this.sourceData // can pass alternative data array for verification
      assert.equals(this.endSpy.callCount, 1, 'ReadStream emitted single "end" event')
      assert.equals(this.dataSpy.callCount, data.length, 'ReadStream emitted correct number of "data" events')
      data.forEach(function (d, i) {
        var call = this.dataSpy.getCall(i)
        if (call) {
          assert.equals(call.args.length, 1, 'ReadStream "data" event #' + i + ' fired with 1 argument')
          refute.isNull(call.args[0].key, 'ReadStream "data" event #' + i + ' argument has "key" property')
          refute.isNull(call.args[0].value, 'ReadStream "data" event #' + i + ' argument has "value" property')
          assert.equals(call.args[0].key, d.key, 'ReadStream "data" event #' + i + ' argument has correct "key"')
          assert.equals(
              +call.args[0].value
            , +d.value
            , 'ReadStream "data" event #' + i + ' argument has correct "value"'
          )
        }
      }.bind(this))
      done()
    }, 0.05, this)

    done()

  }.bind(this))
}
