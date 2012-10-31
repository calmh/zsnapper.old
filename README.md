```
 _______ _ __   __ _ _ __  _ __   ___ _ __
|_  / __| '_ \ / _` | '_ \| '_ \ / _ \ '__|
 / /\__ \ | | | (_| | |_) | |_) |  __/ |
/___|___/_| |_|\__,_| .__/| .__/ \___|_|
                    |_|   |_|
```

This is a ZFS snapshotting service for Solaris, OpenIndiana, SmartOS and
friends. It takes periodic snapshots of the datasets you specify, at whatever
intervals you like. You tell it how many of each kind to keep around and the
rest gets cleaned out.

Installation
============

SmartOS
-------

### Build the tar.gz

Two alternatives:

 1. Use my "compiled" version from http://nym.se/smartos/zsnapper.tar.gz

 2.  In a zone that has npm and build tools available, or on a machine running
     Mac OS X or whatever with Node.js installed:

     ```
     # git clone https://github.com/calmh/zsnapper.git
     # cd zsnapper
     # fakeroot make smartos
     ```

Transfer the tarball to your GZ and unpack it from the root. Read below about
configuring (the config file is in `/opt/local/etc`), then enable the service
with `svcadm import /opt/custom/smf/zsnapper.xml`. Check the log
`/var/svc/log/site-zsnapper.log` for issues.

Non-SmartOS Solaris, Linux, or FreeBSD
--------------------------------------

    # npm -g install zsnapper

Configure
---------

Copy the config file `zsnapper.json.sample` (probably installed in
`/usr/local/lib/node_modules/zsnapper` by npm) to
`/etc/zsnapper.json` and update it with your desired configuration.

It's a JSON file of the format:

    {
        <dataset name>: {
            <snapshot name>: {
                "when": <cron string>,
                "count": <number of snapshots>,
                "exclude": [ <dataset to be excluded>, ... ]
            },
            <snapshot name>: {
                "when": <cron string>,
                "count": <number of snapshots>,
                "exclude": [ <dataset to be excluded>, ... ]
            }
        },
        <dataset name>: {
            ...
        }
    }

Where:

  - *dataset name* is a name of a dataset to snapshot. Example: `zones`.

  - *snapshot name* is a base to build snapshot names of. The current date and
    time will be appended. Example: `daily` which will result in snapshot names
    of the type `daily-20120515T1314900Z`.

  - *cron string* is a cron-format description of when the snapshot should be
    taken. `man 5 crontab` for details. Example: `15 0 * * 1` for snapshots at
    00:15 the first of every month.

  - *number of snapshots* is the number of snapshots that should be kept
    historically before being destroyed.

  - *exclude* is a list of dataset names (under the main *dataset name*) that
    should not be snapshotted. Example: `[ "zones/swap", "zones/dump" ]`.

Start
-----

To test the setup, start the service (as root) with the name of the config file
as the only parameter.

    # /usr/local/bin/zsnapper /etc/zsnapper.json

A better alternative, once everything seems to work as intended, is to use the
accompanying SMF manifest. Copy `zsnapper.xml` from
`/usr/local/lib/node_modules/zsnapper` to your home directory and edit it to
suit your installation. The only things you need to modify are the paths to the
`zsnapper` executable and the `zsnapper.json` config file. Then import it:

    # svccfg import zsnapper.xml

The service should be started automatically, which you can verify:

    # svcs site/zsnapper
    STATE          STIME    FMRI
    online         10:56:26 svc:/site/zsnapper:default

License
-------

MIT

