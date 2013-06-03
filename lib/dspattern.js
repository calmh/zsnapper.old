"use strict";

var async = require('async');
var dsglob = require('./dsglob.js');
var shellexp = require('./shellexp.js');

module.exports = function (pat, cb) {
    shellexp(pat, function (err, res) {
        if (err) {
            return cb(err);
        }

        async.mapSeries(res, dsglob, function (err, res) {
            if (err) {
                return cb(err);
            }

            var merged = [];
            merged = merged.concat.apply(merged, res);
            cb(null, merged);
        });
    });
};
