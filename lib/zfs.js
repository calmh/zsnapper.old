"use strict";

var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var util = require('util');

function compact(array) {
    return array.filter(function (i) {
        if (typeof i.length !== 'undefined')
            return i.length > 0;
        return !!i;
    });
}

function findCmd(name) {
    "use strict";

    var paths = process.env['PATH'].split(':');
    var pathLen = paths.length;
    for (var i = 0; i < pathLen; i++) {
        var sp = path.resolve(paths[i]);
        var fname = path.normalize(path.join(sp, name));
        if (fs.existsSync(fname)) {
            return fname;
        }
    }

    return null;
}

var zfsBin = findCmd('zfs');

function zfs(args, callback) {
    execFile(zfsBin, args, {maxBuffer: 8000000}, function (err, stdout, stderr) {
        if (callback && typeof callback === 'function') {
            if (err) {
                err.message = compact(err.message.split('\n')).join('; ').trim();
                callback(err);
            } else {
                callback(null, stdout);
            }
        }
    });
}

zfs.list = function list(extraParams, cb) {
    var params = ['list', '-H', '-o', 'name'].concat(extraParams || []);

    zfs(params, function (err, stdout) {
        if (cb && typeof cb === 'function') {
            var lines = compact(stdout.split('\n'));
            cb(err, lines);
        }
    });
};

module.exports = zfs;
