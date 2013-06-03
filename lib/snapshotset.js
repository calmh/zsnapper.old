"use strict";

var async = require('async');
var util = require('util');

var zfs = require('./zfs');

function snapshotName(base) {
    var when = (new Date()).toISOString().replace(/[-:]|(\.\d\d\d)/g, '');
    return base + '-' + when;
}

function SnapshotSet(dataset, tag) {
    this.dataset = dataset;
    this.tag = tag;
}

SnapshotSet.prototype.snapshot = function (cb) {
    var name = snapshotName(this.tag);
    var snap = this.dataset + '@' + name;
    util.log('snapshot ' + snap)
    zfs(['snapshot', '-r', this.dataset + '@' + name], cb);
};

SnapshotSet.prototype.list = function (cb) {
    var self = this;
    var re = new RegExp(self.dataset + '@' + self.tag + '-');

    zfs.list(['-t', 'snapshot', '-r', '-d', '1', self.dataset], function (err, snaps) {
        if (err) {
            return cb(err);
        }

        var names = snaps.filter(function (n) {
            return n.match(re);
        });
        names.sort();
        cb(null, names);
    });
};

SnapshotSet.prototype.prune = function (num, cb) {
    var self = this;

    self.list(function (err, snaps) {
        if (err) {
            return cb(err);
        }

        var toDestroy = snaps.slice(0, snaps.length - num);
        async.eachSeries(toDestroy, function (snap, cb) {
            util.log('destroy ' + snap)
            zfs(['destroy', '-r', snap], cb);
        }, cb);
    });
};

module.exports = SnapshotSet;
