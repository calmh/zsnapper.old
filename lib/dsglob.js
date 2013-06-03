"use strict";

var minimatch = require('minimatch');

var zfs = require('./zfs');

module.exports = function (glob, cb) {
    zfs.list(['-t', 'filesystem,volume'], function (err, datasets) {
        if (err)
            return cb(err);
        var found = datasets.filter(minimatch.filter(glob));
        cb(null, found);
    });
};
