"use strict";

var async = require('async');
var exec = require('child_process').exec;

function compact(list) {
    return list.filter(function (i) {
        if (typeof i.length !== 'undefined') {
            return i.length > 0;
        }
        return !!i;
    });
}

function combine(string, repls) {
    var pats = string.match(/\$\([^\)]+\)/g);
    if (!pats) {
        return [string];
    }

    var res = [];
    var pat = pats[0];
    var rep = repls[pat];
    for (var i = 0; i < rep.length; i++) {
        res = res.concat(combine(string.replace(pat, rep[i]), repls));
    }

    return res;
}

module.exports = function (string, cb) {
    var pats = string.match(/\$\([^\)]+\)/g);
    if (!pats) {
        return cb(null, [string]);
    }

    var exps = {};
    async.forEach(pats, function (pat, cb) {
        var cmd = pat.slice(2, -1);
        var res = exec(cmd, function (err, stdout, stderr) {
            if (err) {
                return cb(err);
            }

            exps[pat] = compact(stdout.toString().split('\n'));
            cb(null);
        });
    }, function (err) {
        if (err) {
            return cb(err);
        }
        cb(null, combine(string, exps));
    });
};
