      ____     ____    ___      __     _____   _____      __   _ __ 
     /\_ ,`\  /',__\ /' _ `\  /'__`\  /\ '__`\/\ '__`\  /'__`\/\`'__\
     \/_/  /_/\__, `\/\ \/\ \/\ \L\.\_\ \ \L\ \ \ \L\ \/\  __/\ \ \/
       /\____\/\____/\ \_\ \_\ \__/.\_\\ \ ,__/\ \ ,__/\ \____\\ \_\
       \/____/\/___/  \/_/\/_/\/__/\/_/ \ \ \/  \ \ \/  \/____/ \/_/
                                         \ \_\   \ \_\
                                          \/_/    \/_/

This is a ZFS snapshotting service for Solaris, OpenIndiana, SmartOS and friends.

Installation
============

Unpack
------

Clone this repository (or unpack the download) into `/opt/nym/zsnapper`. Any
other directory will do as well, but you will need to modify the SMF manifest
to update the paths.

Install dependencies
--------------------

Run `npm install` in `/opt/nym/zsnapper`.

Configure
---------

Update the config file `zsnapper` conf with your desired snapshot configuration.
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

    # /opt/nym/zsnapper/zsnapper /opt/nym/zsnapper/zsnapper.json

A better alternative, once everything seems to work as intended, is to use the
accompanying SMF manifest. Edit `zsnapper.xml` to suit your installation
(particularly the path to the `zsnapper` binary and `zsnapper.json` config
file). Then import it:

    # svccfg import zsnapper.xml

The service should be started automatically, which you can verify:

    # svcs site/zsnapper
    STATE          STIME    FMRI
    online         10:56:26 svc:/site/zsnapper:default
