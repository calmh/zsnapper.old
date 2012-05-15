#!/usr/bin/node

var _ = require('underscore');
var async = require('async');
var CronJob = require('cron').CronJob;
var util = require('util');
var zfs = require('zfs')
var fs = require('fs')

// Zero pad an integer to the specified length.
function padInteger(num, length) {
    "use strict";

    var r = '' + num;
    while (r.length < length) {
        r = '0' + r;
    }
    return r;
}

// Format a date to yyyymmddThhmmssZ (UTC).
function formatDate(d) {
    "use strict";

    var year, month, day, hour, minute, second;
    year = d.getUTCFullYear();
    month = padInteger(d.getUTCMonth() + 1, 2);
    day = padInteger(d.getUTCDate(), 2);
    hour = padInteger(d.getUTCHours(), 2);
    minute = padInteger(d.getUTCMinutes(), 2);
    second = padInteger(d.getUTCSeconds(), 2);
    return year + month + day + 'T' + hour + minute + second + 'Z';
};

// Generate a snapshot name given a base.
function snapshotName(base) {
    "use strict";

    var when = formatDate(new Date());
    return base + '-' + when;
}

// Create a snapshot on the specified dataset with the specified name, exluding all datasets in excl.
function createSnapshot(ds, sn, excl) {
    "use strict";

    function destroyExcludes(snaps, excl) {
        var toDestroy = snaps.filter(function (s) {
            var fields = s.name.split('@');
            var createdNow = fields[1] === sn;
            var inExclude = _.contains(excl, fields[0]);
            return createdNow && inExclude;
        });

        async.forEachSeries(toDestroy, function (snap, cb) {
            util.log('Destroy snapshot ' + snap.name + ' (excluded)');
            zfs.destroy({ name: snap.name, recursive: true }, cb);
        });
    }

    util.log('Create snapshot ' + ds + '@' + sn);
    zfs.snapshot({ dataset: ds, name: sn, recursive: true }, function (err) {
        if (err) {
            util.log(err);
        } else {
            zfs.list({ type: 'snapshot' }, function (err, snaps) {
                if (err) {
                    util.log(err);
                } else {
                    destroyExcludes(snaps, excl);
                }
            });
        }
    });
}

// Keep only num snapshots with the specified base on the specified dataset
function cleanSnapshots(ds, base, num) {
    zfs.list({ type: 'snapshot' }, function (err, snaps) {
        // Find all snapshots that match the specified dataset and base.
        var ourSnaps = snaps.filter(function (s) {
            var fields = s.name.split('@');
            var parts = fields[1].split('-');
            return fields[0] === ds && parts[0] === base;
        });

        if (ourSnaps.length > num) {
            // Get just the sorted list of names.
            var snapNames = ourSnaps.map(function (s) { return s.name; });
            snapNames.sort();

            // Get the ones that exceed the specified number of snapshots.
            var toDestroy = snapNames.slice(0, snapNames.length - num);

            // Destroy them, one after the other.
            async.forEachSeries(toDestroy, function (sn, cb) {
                util.log('Destroy snapshot ' + sn + ' (cleaned)');
                zfs.destroy({ name: sn, recursive: true }, cb);
            });
        }
    });
}

function snapshot(dataset, base, excl, num) {
    var name = snapshotName(base);
    createSnapshot(dataset, name, excl);
    cleanSnapshots(dataset, base, num);
}

function loadConfig() {
    var data = fs.readFileSync(process.argv[2], 'utf-8');
    var confObj = JSON.parse(data);
    return confObj;
}

var cronJobs = [];
var conf = loadConfig();
_.each(conf, function (jobs, dataset) {
    _.each(jobs, function (config, name) {
        var job = new CronJob('00 ' + config.when, function () {
            var excl = config.exclude || [];
            snapshot(dataset, name, excl, parseInt(config.count, 10));
        }, null, true, 'UTC');
        cronJobs.push(job);
    });
});
